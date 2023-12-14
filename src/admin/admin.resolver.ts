import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { AdminService } from './admin.service';
import { UserEntity } from "@src/user/entity/user-entity";
import { BanDto } from "@src/admin/dto/ban-dto";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "@src/auth/guards/jwt-auth-guard";
import { RolesGuard } from "@src/auth/guards/role-guard";
import { Roles } from "@app/common/decorators/roles-decorator";

@Resolver()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
export class AdminResolver {
    constructor(private readonly adminService: AdminService) {}

    @Mutation(() => UserEntity)
    async banUser(@Args('input') dto: BanDto) {
        try {
            return this.adminService.banUser(dto.id, dto.isBlock);
        } catch (error) {
            throw error;
        }
    }
}