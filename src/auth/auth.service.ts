import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register-dto';
import { UserService } from 'src/user/user.service';
import { UserId } from './endity/userId-endity';
import { LoginDto } from "./dto/login-dto";

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UserService,
    ) {}

    async register(dto: RegisterDto): Promise<UserId> {
        const userId = await this.userService.createUser(dto)
        return userId
    }

    async login(dto: LoginDto) {
        return ''
    }

    private async generateTokens() {}

    private async getRefreshToken() { }
    
    async refreshTokens() {}

    deleteRefreshToken() {}

    async providerAuth() {}
}
