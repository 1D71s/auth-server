import { ForbiddenException, Injectable } from "@nestjs/common";
import { ChangeRoleDto } from "@src/admin/roles/dto/change-role-dto";
import { UserService } from "@src/user/user.service";
import { PrismaService } from "@src/common/prisma/prisma";
import { Role, User } from "@prisma/client";
import { JwtPayloadUser } from "@src/auth/iterfaces";
import { RoleDto } from "@src/admin/roles/dto/role-dto";

@Injectable()
export class RolesService {
    constructor(
       private readonly userService: UserService,
       private readonly prisma: PrismaService
    ) {}

    async changeRole(dto: ChangeRoleDto, user: JwtPayloadUser) {
        const checkAccess = this.checkRoleHierarchy(user.role ,dto.role);
        const userForNewRole = await this.userService.getUser(dto.id)

        if (!checkAccess || !userForNewRole) {
            throw new ForbiddenException('Access denied');
        }

        return this.prisma.user.update({
            where: { id: dto.id },
            data: { role: dto.role as Role }
        })
    }

    async getUsersWithRoles(dto: RoleDto): Promise<User[]> {
        return this.prisma.user.findMany({ where: { role: dto.role as Role } });
    }

    public checkRoleHierarchy(userRole: string, requiredRole: string): boolean {
        const hierarchy: Record<string, string[]> = {
            [Role.MOOD]: [Role.ADMIN, Role.MODER, Role.USER],
            [Role.ADMIN]: [Role.MODER, Role.USER],
            [Role.MODER]: [Role.USER],
            [Role.USER]: [],
        };

        const allowedRoles = hierarchy[userRole];
        return allowedRoles ? allowedRoles.includes(requiredRole) : false;
    }
}