import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register-dto';
import { UserId } from './endity/userId-endity';
import { BadRequestException } from '@nestjs/common';
import { Token } from "./endity/token-endity";
import { LoginDto } from "./dto/login-dto";

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
    async login(@Args('input') dto: LoginDto) {
        try {
            const tokens = await this.authService.login(dto);
            if (!tokens) {
                throw new BadRequestException(`Can't login with deta: ${JSON.stringify(dto)}`);
            }

        } catch (error) {
            throw error;
        }
    }

    logOut() { }
    
    refreshTokens() { }
    
    sendRefreshTokenToCookies() { }
    
    googleAuth() { }
    
    googleAuthCallback() { }
    
    successGoogle() { }
}
