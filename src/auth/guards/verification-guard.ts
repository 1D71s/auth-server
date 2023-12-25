import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class CheckVerificationGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {

        const ctx = GqlExecutionContext.create(context);
        const verificationEmail = ctx.getContext().req.user.emailVerify;

        if (!verificationEmail) {
            throw new UnauthorizedException("User account is not verified");
        }

        return true
    }
}