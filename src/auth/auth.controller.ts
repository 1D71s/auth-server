import { UserAgent } from '@app/common/decorators/user-agent-decorator';
import { Controller, Get, Req, Res, UseGuards, Query } from "@nestjs/common";
import { AuthService } from './auth.service';
import { ReqGoogleUser } from "@src/auth/iterfaces";
import { GoogleGuard } from "@src/auth/guards/google-auth.guard";
import { Response } from "express";
import { HttpService } from "@nestjs/axios";

@Controller()
export class AuthController {

    constructor(
      private readonly authService: AuthService,
      private readonly httpService: HttpService
    ) { }

    @Get('google')
    @UseGuards(GoogleGuard)
    async googleAuth() {}

    @Get('google/redirect')
    @UseGuards(GoogleGuard)
    googleAuthRedirect(@Req() req: ReqGoogleUser, @Res() res: Response) {
        const token = req.user['accessToken'];
        return res.redirect(`http://localhost:6002/success-google?token=${token}`);
    }

    @Get('success-google')
    async successGoogle(@Query('token') token: string, @UserAgent() agent: string, @Res() res: Response) {
        try {
            const { data } = await this.httpService.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`).toPromise();
            const tokens = await this.authService.googleAuth(data, agent);
            await this.authService.sendRefreshTokenToCookies(tokens, res);
            res.json({ accessToken: tokens.accessToken });
        } catch (error) {
            res.status(500).send('Internal Server Error');
        }
    }
}