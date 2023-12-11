import { UserAgent } from '@app/common/decorators/user-agent-decorator';
import { Controller, Get, Req, Res, UseGuards, Query } from "@nestjs/common";
import { AuthService } from './auth.service';
import { ReqGoogleUser } from "@src/auth/iterfaces";
import { GoogleGuard } from "@src/auth/guards/google-auth.guard";
import { Response } from "express";
import { HttpService } from "@nestjs/axios";
import { UserService } from "@src/user/user.service";
import { Provider } from "@prisma/client";

@Controller()
export class AuthController {

    constructor(
      private readonly authService: AuthService,
      private readonly httpService: HttpService,
      private readonly userService: UserService
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
            const checkUser = await this.userService.getUser(data.email);

            if (checkUser && checkUser.provider !== Provider.GOOGLE) {
                res.json({ message: 'this email is used without googleAuth!', success: false });
                return;
            }

            const tokens = await this.authService.googleAuth(data, agent);
            await this.authService.sendRefreshTokenToCookies(tokens, res);
            res.json({ accessToken: tokens.accessToken });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}