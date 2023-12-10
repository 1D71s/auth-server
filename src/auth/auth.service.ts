import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { RegisterDto } from './dto/register-dto';
import { UserService } from 'src/user/user.service';
import { UserId } from './endity/userId-endity';
import { LoginDto } from "./dto/login-dto";
import { compareSync } from 'bcrypt';
import { Provider, Token, User } from "@prisma/client";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "@src/common/prisma/prisma";
import { add } from 'date-fns';
import { v4 } from 'uuid';
import { GoogleUser, Tokens } from "./iterfaces";
import { AccessToken } from "./endity/token-endity";
import { Response } from "express";


@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly prismaService: PrismaService
    ) {}

    async register(dto: RegisterDto): Promise<UserId> {
        return this.userService.createUser(dto);
    }

    async login(dto: LoginDto, agent: string): Promise<Tokens> {
        const user = await this.userService.getUser(dto.email)

        if (!user || !compareSync(dto.password, user.password)) {
            throw new UnauthorizedException('Wrong login or password!');
        }

        return this.generateTokens(user, agent)
    }

    private async generateTokens(user: User, agent: string): Promise<Tokens> {
        const accessToken =
            'Bearer ' +
            this.jwtService.sign({
                id: user.id,
                email: user.email,
                role: user.role,
            });

        const refreshToken = await this.getRefreshToken(user.id, agent);

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

    deleteRefreshToken(token: string): Promise<Token> {
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

    async googleAuth(googleUser: GoogleUser, agent: string) {

        const { email, firstName } = googleUser;

        const userExist = await this.userService.getUser(email)

        if (userExist && userExist.provider === Provider.GOOGLE) {
            return this.generateTokens(userExist, agent)
        }

        const user = await this.userService.createUser({
            email,
            name: firstName,
            provider: Provider.GOOGLE
        })

        if (!user) {
            throw new BadRequestException(`Не получилось создать пользователя с email ${email} в Google auth`);
        }

        const newUser = await this.userService.getUser(user.id);

        return this.generateTokens(newUser, agent);
    }
}