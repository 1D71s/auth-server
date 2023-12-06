import { Injectable, UnauthorizedException } from "@nestjs/common";
import { RegisterDto } from './dto/register-dto';
import { UserService } from 'src/user/user.service';
import { UserId } from './endity/userId-endity';
import { LoginDto } from "./dto/login-dto";
import { compareSync } from 'bcrypt';
import { Token, User } from "@prisma/client";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "@src/common/prisma/prisma";
import { add } from 'date-fns';
import { v4 } from 'uuid';
import { Tokens } from "./iterfaces";

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly prismaService: PrismaService
    ) {}

    async register(dto: RegisterDto): Promise<UserId> {
        const userId = await this.userService.createUser(dto);
        return userId;
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
            const updatedToken = await this.prismaService.token.update({
                where: { token: _token.token },
                data: {
                    token: v4(),
                    exp: add(new Date(), { months: 1 }),
                },
            })

            return updatedToken
        } 
        
        const newToken = await this.prismaService.token.create({
            data: {
                token: v4(),
                exp: add(new Date(), { months: 1 }),
                userId,
                UserAgent: agent,
            },
        });

        return newToken
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

    async providerAuth() {}
}
