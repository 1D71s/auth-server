import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { BanService } from './ban.service';
import { BanDto } from "@src/admin/ban/dto/ban-dto";
import { User } from "@app/common/decorators/getData/getuser-decorator";
import { JwtPayloadUser } from "@src/auth/iterfaces";
import { BadRequestException, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "@src/auth/guards/jwt-auth-guard";
import { RolesGuard } from "@src/auth/guards/role-guard";
import { Roles } from "@app/common/decorators/getData/roles-decorator";
import { BanEntity } from "@src/admin/ban/endity/ban-endity";
import { IdUserDto } from "@src/user/dto/id-user-dto";
import { UserService } from "@src/user/user.service";

@Resolver()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("MOOD", "ADMIN", "MODER")
export class BanResolver {
    constructor(
        private readonly banService: BanService,
        private readonly userService: UserService
    ) {}

    @Mutation(() => BanEntity)
    async banUser(@Args('input') dto: BanDto, @User() user: JwtPayloadUser) {
        try {
            return this.banService.banUser(dto, user.id);
        } catch (error) {
            throw new BadRequestException("Something went wrong.");
        }
    }

    @Query(() => [BanEntity])
    async getUserBansForAdmin(@Args('input') dto: IdUserDto) {
        try {
            return this.userService.getUserBans(dto.id)
        } catch (error) {
            throw new BadRequestException("Something went wrong.");
        }
    }
}
