import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { UserAdminService } from './user.admin.service';
import { Message } from "@src/common/global-endity/message-endity";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "@src/auth/guards/jwt-auth-guard";
import { User } from "@app/common/decorators/getData/getuser-decorator";
import { JwtPayloadUser } from "@src/auth/iterfaces";
import { Roles } from "@app/common/decorators/getData/roles-decorator";
import { ChangePasswordAdminDto } from "@src/admin/user.admin/dto/change-password-admin-dto";
import { IdDto } from "@src/common/global-dto/id-dto";

@Resolver()
@Roles("MOOD", "ADMIN")
export class UserAdminResolver {
    constructor(private readonly userAdminService: UserAdminService) {}

    @Mutation(() => Message)
    @UseGuards(JwtAuthGuard)
    deleteUserAsAdmin(@Args('input') dto: IdDto, @User() admin: JwtPayloadUser) {
        try {
            return this.userAdminService.deleteUserAsAdmin(dto.id, admin);
        } catch (error) {
            throw error;
        }
    }

    @Mutation(() => Message)
    @UseGuards(JwtAuthGuard)
    changePasswordAsAdmin(@Args('input') dto: ChangePasswordAdminDto, @User() admin: JwtPayloadUser) {
        try {
            return this.userAdminService.changePasswordAsAdmin(dto, admin);
        } catch (error) {
            throw error;
        }
    }
}
