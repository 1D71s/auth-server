import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register-dto';
import { UserId } from './endity/userId-entity';
import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import { Token } from '@prisma/client';
import { LoginDto } from "./dto/login-dto";
import { Response } from "express";
import { UserAgent } from "@app/common/decorators/getData/user-agent-decorator";
import { Message } from '@src/common/global-endity/message-entity';
import { RefreshToken } from '@app/common/decorators/getData/refreshtoken-decorator';
import { AccessToken } from './endity/token-entity';
import { UserEmail } from "@src/auth/dto/user-email";
import { ResetPasswordDto } from "@src/auth/dto/reset-password-dto";

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

    @Mutation(() => AccessToken)
    async login(@Args('input') dto: LoginDto, @Context('res') res: Response, @UserAgent() agent: string) {
        try {
            const tokens = await this.authService.login(dto, agent);

            if (!tokens) {
                throw new BadRequestException(`Can't login with data: ${JSON.stringify(dto)}`);
            }

            return this.authService.sendRefreshTokenToCookies(tokens, res)
        } catch (error) {
            throw error;
        }
    }

    @Mutation(() => Boolean)
    sendPasswordUpdateEmail(@Args('input') dto: UserEmail, @UserAgent() agent: string) {
        try {
            return this.authService.sendPasswordUpdateEmail(dto, agent);
        } catch (error) {
            throw error;
        }
    }

    @Mutation(() => Message)
    resetPassword(@Args('input') dto: ResetPasswordDto) {
        try {
            return this.authService.resetPassword(dto)
        } catch (error) {
            throw error;
        }
    }

    @Mutation(() => Message)
    async logout(@RefreshToken() refreshToken: Token | null, @Context('res') res: Response) {
        try {
            const token = refreshToken?.token
    
            await this.authService.deleteRefreshToken(token);

            res.cookie('REFRESH_TOKEN', '', { httpOnly: true, secure: true, expires: new Date() });
    
            return { success: true, message: 'Logout successful!' };
        } catch (error) {
            throw error;
        }
    }
    
    @Query(() => AccessToken)
    async updateTokens(@RefreshToken() refreshToken: Token, @Context('res') res: Response, @UserAgent() agent: string) {
        try {
            if (!refreshToken) {
                throw new UnauthorizedException();
            }

            const tokens = await this.authService.refreshTokens(refreshToken, agent);

            if (!tokens) {
                throw new UnauthorizedException();
            }
            return this.authService.sendRefreshTokenToCookies(tokens, res);
        } catch (error) {
            throw error;
        }
    }
}