import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Token } from "@prisma/client";
import { PrismaService } from "@src/common/prisma/prisma";
import { UserService } from "@src/user/user.service";
import { RolesService } from "@src/admin/roles/roles.service";
import { JwtPayloadUser } from "@src/auth/iterfaces";
import { SessionsService } from "@src/sessions/sessions.service";
import { Message } from "@src/common/global-endity/message-endity";

@Injectable()
export class SessionsAdminService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly userService: UserService,
        private readonly rolesService: RolesService,
        private readonly sessionsService: SessionsService
    ) {}

    async closeOneSessionAsAdmin() {}

    async closeAllUserSessionAsAdmin(userId: string, admin: JwtPayloadUser): Promise<Message> {
        const checkAccess = this.checkAccessByRole(userId, admin.role)

        if (!checkAccess) {
            throw new ForbiddenException("No access!");
        }

        return this.sessionsService.closeAllUserSession(userId);
    }

    async getAllUserSessionsAsAdmin(userId: string, admin: JwtPayloadUser): Promise<Token[]> {
        const checkAccess = this.checkAccessByRole(admin.role, userId)

        if (!checkAccess) {
            throw new ForbiddenException("No access!");
        }

        return this.sessionsService.getAllUserSessions(userId);
    }

    async getAllSessionsAsAdmin(): Promise<Token[]> {
        return this.prisma.token.findMany();
    }

    private async checkAccessByRole(adminRole: string, userId: string): Promise<boolean> {
        const user = await this.userService.getUser(userId);

        if (!user) {
            throw new NotFoundException({ message: 'User is not found!' });
        }

        return this.rolesService.checkRoleHierarchy(adminRole, user.role);
    }
}