import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Token } from "@prisma/client";
import { PrismaService } from "@src/common/prisma/prisma";
import { UserService } from "@src/user/user.service";
import { RolesService } from "@src/admin/roles/roles.service";
import { JwtPayloadUser } from "@src/auth/iterfaces";
import { SessionsService } from "@src/sessions/sessions.service";
import { Message } from "@src/common/global-endity/message-endity";
import { TokenUserIdDto } from "@src/admin/sessions.admin/dto/token-userId-dto";

@Injectable()
export class SessionsAdminService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly userService: UserService,
        private readonly rolesService: RolesService,
        private readonly sessionsService: SessionsService
    ) {}

    async closeOneSessionAsAdmin(dto: TokenUserIdDto, admin: JwtPayloadUser) {
        const user = await this.userService.getUser(dto.id);

        if (!user) {
            throw new NotFoundException({ message: 'User is not found!' });
        }

        const checkAccess = this.rolesService.checkRoleHierarchy(admin.role, user.role)

        if (!checkAccess) {
            throw new ForbiddenException("No access!");
        }

        return this.sessionsService.closeOneSession(dto.token, dto.id);
    }

    async closeAllUserSessionAsAdmin(userId: string, admin: JwtPayloadUser): Promise<Message> {
        const user = await this.userService.getUser(userId);

        if (!user) {
            throw new NotFoundException({ message: 'User is not found!' });
        }

        const checkAccess = this.rolesService.checkRoleHierarchy(admin.role, user.role)

        if (!checkAccess) {
            throw new ForbiddenException("No access!");
        }

        return this.sessionsService.closeAllUserSession(userId);
    }

    async getAllUserSessionsAsAdmin(userId: string, admin: JwtPayloadUser): Promise<Token[]> {
        const user = await this.userService.getUser(userId);

        if (!user) {
            throw new NotFoundException({ message: 'User is not found!' });
        }

        const checkAccess = this.rolesService.checkRoleHierarchy(admin.role, user.role)

        if (!checkAccess) {
            throw new ForbiddenException("No access!");
        }

        return this.sessionsService.getAllUserSessions(userId);
    }

    async getAllSessionsAsAdmin(): Promise<Token[]> {
        return this.prisma.token.findMany();
    }
}