import { UserAgent } from '@app/common/decorators/user-agent-decorator';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ReqGoogleUser } from "@src/auth/iterfaces";


@Controller('google')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
    ) { }
    
    @Get()
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req: Request) {}

    @Get('redirect')
    @UseGuards(AuthGuard('google'))
    googleAuthRedirect(@Req() req: ReqGoogleUser, @UserAgent() agent: string) {
        return this.authService.googleAuth(req.user, agent)
    }
}