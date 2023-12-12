import { ROLES_KEY } from "@app/common/decorators/roles-decorator";
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { GqlExecutionContext } from "@nestjs/graphql";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector, private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
                context.getHandler(),
                context.getClass(),
            ]);

            if (!requiredRoles) {
                return true;
            }

            const ctx = GqlExecutionContext.create(context);
            const { req } = ctx.getContext();

            const tokenBearer = req.headers.authorization;
            const token = tokenBearer.split(' ')[1];

            if (!token) {
                throw new UnauthorizedException({ message: 'Token not provided' });
            }

            const user = await this.jwtService.verifyAsync(
                token, { secret: process.env.JWT_SECRET }
            );


            if (!user.id) {
                throw new UnauthorizedException({ message: 'Invalid token' });
            }

            return requiredRoles.some((role) => user.role?.includes(role));
        } catch (error) {
            throw new UnauthorizedException({ message: 'No access!' });
        }
    }
}

