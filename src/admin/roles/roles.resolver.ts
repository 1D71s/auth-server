import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { RolesService } from './roles.service';
import { BadRequestException } from "@nestjs/common";
import { UserEntity } from "@src/user/entity/user-entity";
import { Roles } from "@app/common/decorators/getData/roles-decorator";
import { User } from "@app/common/decorators/getData/getuser-decorator";
import { ChangeRoleDto } from "@src/admin/roles/dto/change-role-dto";
import { JwtPayloadUser } from "@src/auth/iterfaces";
import { RoleDto } from "@src/admin/roles/dto/role-dto";

@Resolver()
@Roles("MOOD", "ADMIN")
export class RolesResolver {
    constructor(private readonly rolesService: RolesService) {}

    @Mutation(() => UserEntity)
    changeRole(@Args('input') dto: ChangeRoleDto, @User() user: JwtPayloadUser) {
        try {
            return this.rolesService.changeRole(dto, user);
        } catch (error) {
            throw new BadRequestException("Something went wrong.");
        }
    }

    @Query(() => [UserEntity])
    getUsersWithRoles(@Args('input') dto: RoleDto) {
        try {
            return this.rolesService.getUsersWithRoles(dto)
        } catch (error) {
            throw new BadRequestException("Something went wrong.");
        }
    }
}