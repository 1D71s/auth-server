import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { Role } from '@prisma/client';
import { RolesGuard } from "@src/auth/guards/role-guard";
import { JwtAuthGuard } from "@src/auth/guards/jwt-auth-guard";

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => {
    return applyDecorators(
        SetMetadata(ROLES_KEY, roles),
        UseGuards(JwtAuthGuard, RolesGuard),
    );
};