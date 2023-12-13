import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { AdminService } from './admin.service';
import { UserEntity } from "@src/user/entity/user-entity";
import { BanDto } from "@src/admin/dto/ban-dto";
import { Message } from "@src/common/global-endity/message-endity";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "@src/auth/guards/jwt-auth-guard";
import { RolesGuard } from "@src/auth/guards/role-guard";
import { Roles } from "@app/common/decorators/roles-decorator";
import { User } from "@app/common/decorators/getuser-decorator";

@Resolver()
export class AdminResolver {
    constructor(private readonly adminService: AdminService) {}

    @Mutation(() => UserEntity)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles("ADMIN")
    async banUser(@Args('input') dto: BanDto) {
        try {
            return this.adminService.banUser(dto.id, dto.isBlock);
        } catch (error) {
            throw error;
        }
    }
}