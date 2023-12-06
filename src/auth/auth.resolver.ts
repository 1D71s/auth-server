import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register-dto';
import { UserId } from './endity/userId-endity';
import { BadRequestException, UnauthorizedException, UseGuards } from "@nestjs/common";
import { Token } from "./endity/token-endity";
import { LoginDto } from "./dto/login-dto";
import { Response } from "express";
import { Tokens } from "@src/auth/iterfaces";
import { UserAgent } from "@app/common/decorators/user-agent-decorator";
import { Message } from '@src/common/global-endity/message-endity';
import { Cookie } from '@app/common/decorators/cookie-decorator';

@Resolver()
export class AuthResolver {

    constructor(private readonly authService: AuthService) { }

    @Mutation(() => UserId)
    async register(@Args('input') dto: RegisterDto) {
        try {
            const userId = await this.authService.register(dto);

            if (!userId) {
                throw new BadRequestException(
                    `Can't register user with data: ${JSON.stringify(dto)}`
                )
            }
            return userId;
        } catch (error) {
            throw error;
        }
    }

    @Mutation(() => Token)
    async login(@Args('input') dto: LoginDto, @Context('res') res: Response, @UserAgent() agent: string) {
        try {
            const tokens = await this.authService.login(dto, agent);

            if (!tokens) {
                throw new BadRequestException(`Can't login with deta: ${JSON.stringify(dto)}`);
            }

            return this.sendRefreshTokenToCookies(tokens, res)
        } catch (error) {
            throw error;
        }
    }
    
    private async sendRefreshTokenToCookies(tokens: Tokens, res: Response) {
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

    @Mutation(() => Message)
    async logout(@Cookie() refreshToken, @Context('res') res: Response) {

        const token = refreshToken["REFRESH_TOKEN"] ? refreshToken["REFRESH_TOKEN"].token : null

        if (!token) {
            return { success: true, message: 'Logout successful!' };
        }

        await this.authService.deleteRefreshToken(token);
        res.cookie('REFRESH_TOKEN', '', { httpOnly: true, secure: true, expires: new Date() });

        return { success: true, message: 'Logout successful!' };
    }
    
    refreshTokens() { }
    
    googleAuth() { }
    
    googleAuthCallback() { }
    
    successGoogle() { }
}
