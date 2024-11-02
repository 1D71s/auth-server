import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { BanService } from './ban.service';
import { BanDto } from "@src/admin/ban/dto/ban-dto";
import { User } from "@app/common/decorators/getData/getuser-decorator";
import { JwtPayloadUser } from "@src/auth/iterfaces";
import { BadRequestException } from "@nestjs/common";
import { Roles } from "@app/common/decorators/getData/roles-decorator";
import { BanEntity } from "@src/admin/ban/endity/ban-entity";
import { IdDto } from "@src/common/global-dto/id-dto";
import { UserService } from "@src/user/user.service";

@Resolver()
@Roles("MOOD", "ADMIN", "MODER")
export class BanResolver {
    constructor(
        private readonly banService: BanService,
        private readonly userService: UserService
    ) {}

    @Mutation(() => BanEntity)
    banUser(@Args('input') dto: BanDto, @User() admin: JwtPayloadUser) {
        try {
            return this.banService.banUser(dto, admin);
        } catch (error) {
            throw error;
        }
    }

    @Query(() => [BanEntity])
    getUserBansForAdmin(@Args('input') dto: IdDto) {
        try {
            return this.userService.getUserBans(dto.id)
        } catch (error) {
            throw error;
        }
    }

    @Mutation(() => BanEntity)
    deleteBan(@Args('input') dto: IdDto, @User() admin: JwtPayloadUser) {
        try {
            return this.banService.deleteBan(dto.id, admin)
        } catch (error) {
            throw error;
        }
    }
}