import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
    UnauthorizedException
} from "@nestjs/common";
import { RegisterDto } from './dto/register-dto';
import { UserService } from 'src/user/user.service';
import { UserId } from './endity/userId-entity';
import { LoginDto } from "./dto/login-dto";
import { compareSync } from 'bcrypt';
import { AttemptType, Provider, Token, User } from "@prisma/client";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "@src/common/prisma/prisma";
import { add } from 'date-fns';
import { v4 } from 'uuid';
import { GoogleUser, Tokens } from "./iterfaces";
import { AccessToken } from "./endity/token-entity";
import { Response } from "express";
import { AttemptService } from "@src/attempt/attempt.service";
import { randomBytes } from 'crypto';
import { UserEmail } from "@src/auth/dto/user-email";
import { MailService } from "@src/mail/mail.service";
import { Message } from "@src/common/global-endity/message-entity";
import { ResetPasswordDto } from "@src/auth/dto/reset-password-dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly prismaService: PrismaService,
        private readonly attemptService: AttemptService,
        private readonly mailService: MailService
    ) {}

    async register(dto: RegisterDto): Promise<UserId> {
        return this.userService.createUser(dto);
    }

    async login(dto: LoginDto, agent: string): Promise<Tokens> {
        const user = await this.userService.getUser(dto.email);

        if (user) {
            const attemptCheck = { userId: user.id, where: AttemptType.LOGIN, user_agent: agent };

            await this.attemptService.check(attemptCheck);

            if (user.provider || !compareSync(dto.password, user.password)) {
                throw new UnauthorizedException('Incorrect email or password.');
            }

            await this.attemptService.remove(attemptCheck);
            return this.generateTokens(user, agent);
        } else {
            throw new UnauthorizedException('User not found.');
        }
    }

    private async generateTokens(user: User, agent: string): Promise<Tokens> {
        const refreshToken = await this.getRefreshToken(user.id, agent);

        const accessToken = this.jwtService.sign({
            id: user.id,
            email: user.email,
            session: refreshToken.token
        });

        return { accessToken, refreshToken };
    }

    private async getRefreshToken(userId: string, agent: string): Promise<Token> {
        const _token = await this.prismaService.token.findFirst({
            where: {
                userId,
                UserAgent: agent,
            },
        });

        if (_token) {
            return  this.prismaService.token.update({
                where: { token: _token.token },
                data: {
                    token: v4(),
                    exp: add(new Date(), { months: 1 }),
                },
            })
        }
        
        return this.prismaService.token.create({
            data: {
                token: v4(),
                exp: add(new Date(), { months: 1 }),
                userId,
                UserAgent: agent,
            },
        });
    }
    
    async refreshTokens(refreshToken: Token, agent: string): Promise<Tokens> {
        const token = await this.prismaService.token.delete({ where: { token: refreshToken.token } });

        if (!token || new Date(token.exp) < new Date()) {
            throw new UnauthorizedException();
        }
        const user = await this.userService.getUser(token.userId);

        return this.generateTokens(user, agent);
    }

    async deleteRefreshToken(token: string): Promise<Token> {
        const tokenToDelete = await this.prismaService.token.findFirst({ where: { token } });

        if (!tokenToDelete) {
            throw new UnauthorizedException("Token Doesn't found!");
        }

        return this.prismaService.token.delete({ where: { token } });
    }
    
    async sendRefreshTokenToCookies(tokens: Tokens, res: Response): Promise<AccessToken> {

        if (!tokens) {
            throw new UnauthorizedException()
        }

        res.cookie("REFRESH_TOKEN", tokens.refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            expires: new Date(tokens.refreshToken.exp),
            path: '/'
        })

        return { accessToken: tokens.accessToken }
    }

    async sendPasswordUpdateEmail(dto: UserEmail, agent: string): Promise<boolean> {
        const user = await this.userService.getUser(dto.email);

        if (!user || user.provider) {
            throw new NotFoundException('User not found.');
        }

        const checkExistReset = await this.prismaService.resetToken.findMany({
            where: { userId: user.id, UserAgent: agent  }
        })

        if (checkExistReset && checkExistReset.some(item => item.exp > new Date())) {
            throw new ConflictException('Reset token already exists and is still valid.');
        }

        await this.prismaService.resetToken.deleteMany({ where: { userId: user.id, UserAgent: agent } });

        const resetToken = this.generateResetToken();

        const expirationDate = new Date();
        expirationDate.setMinutes(expirationDate.getMinutes() + 5);

        const saveToken = await this.prismaService.resetToken.create({
            data: {
                token: resetToken,
                userId: user.id,
                UserAgent: agent,
                exp: expirationDate
            }
        })

        await this.mailService.sendEmail(user.email, 'RESET PASSWORD', saveToken.token);
        return true;
    }

    async resetPassword(dto: ResetPasswordDto): Promise<Message> {
        const resetToken = await this.prismaService.resetToken.findFirst({
            where: { token: dto.token }
        })

        if (!resetToken || resetToken.exp < new Date()) {
            throw new NotFoundException("The token does not exist or has expired.");
        }

        await this.prismaService.resetToken.deleteMany( { where: { token: resetToken.token} } );
        return this.userService.changePassword(resetToken.userId, dto.password);
    }

    private generateResetToken(): string {
        return randomBytes(32).toString('hex');
    }

    async googleAuth(googleUser: GoogleUser, agent: string): Promise<Tokens> {

        const { email } = googleUser;

        const userExist = await this.userService.getUser(email)

        if (userExist) {
            return this.generateTokens(userExist, agent)
        }

        const user = await this.userService.createUser({
            email,
            provider: Provider.GOOGLE
        })

        if (!user) {
            throw new BadRequestException(`Failed to create a user with email ${email} in Google auth`);
        }

        const newUser = await this.userService.getUser(user.id);

        return this.generateTokens(newUser, agent);
    }
}