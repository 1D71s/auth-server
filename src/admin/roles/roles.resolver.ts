import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { RolesService } from './roles.service';
import { BadRequestException, UseGuards } from "@nestjs/common";
import { UserEntity } from "@src/user/entity/user-entity";
import { JwtAuthGuard } from "@src/auth/guards/jwt-auth-guard";
import { RolesGuard } from "@src/auth/guards/role-guard";
import { Roles } from "@app/common/decorators/getData/roles-decorator";
import { User } from "@app/common/decorators/getData/getuser-decorator";
import { ChangeRoleDto } from "@src/admin/roles/dto/change-role-dto";
import { JwtPayloadUser } from "@src/auth/iterfaces";

@Resolver()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("MOOD", "ADMIN")
export class RolesResolver {
    constructor(private readonly rolesService: RolesService) {}

    @Mutation(() => UserEntity)
    async changeRole(@Args('input') dto: ChangeRoleDto, @User() user: JwtPayloadUser) {
        try {
            return this.rolesService.changeRole(dto, user);
        } catch (error) {
            throw new BadRequestException("Something went wrong.");
        }
    }
}