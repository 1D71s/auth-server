import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { Role } from "@prisma/client";
import { ROLES_KEY } from "@app/common/decorators/getData/roles-decorator";
import { UserService } from "@src/user/user.service";
import { BanService } from "@src/admin/ban/ban.service";

@Injectable()
export class CheckBanGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {

        const ctx = GqlExecutionContext.create(context);
        const activeBan = ctx.getContext().req.user.ban;

        if (activeBan) {
            throw new UnauthorizedException("User account blocked!");
        }

        return true
    }
}