import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import * as process from "process";
import { UserService } from "@src/user/user.service";
import { User } from "@prisma/client";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtPayloadUser } from "@src/auth/iterfaces";
import { BanService } from "@src/admin/ban/ban.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly userService: UserService,
        private readonly banService: BanService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: JwtPayloadUser) {
        const user = await this.userService.getUser(payload.id)

        if (!user) {
            throw new UnauthorizedException("Access denied. User account not found.");
        }

        const activeBan = this.banService.checkUserBansByActive(user.bans)

        return { id: payload.id, role: user.role, ban: !!activeBan};
    }
}