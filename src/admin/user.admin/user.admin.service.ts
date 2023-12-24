import { Injectable } from "@nestjs/common";
import { ChangePasswordAdminDto } from "@src/admin/user.admin/dto/change-password-admin-dto";
import { UserService } from "@src/user/user.service";
import { RolesService } from "@src/admin/roles/roles.service";
import { JwtPayloadUser } from "@src/auth/iterfaces";
import { Message } from "@src/common/global-endity/message-endity";

@Injectable()
export class UserAdminService {

    constructor(
        private readonly userService: UserService,
        private readonly rolesService: RolesService,
    ) {}

    async changePasswordAsAdmin(dto: ChangePasswordAdminDto, admin: JwtPayloadUser): Promise<Message> {
        await this.rolesService.validateUserAccess(dto.id, admin)
        return this.userService.changePassword(dto.id, dto.password)
    }

    async deleteUserAsAdmin(userId: string ,admin: JwtPayloadUser): Promise<Message> {
        await this.rolesService.validateUserAccess(userId, admin)
        return this.userService.deleteUser(userId);
    }
}