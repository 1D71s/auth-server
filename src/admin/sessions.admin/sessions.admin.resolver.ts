import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { SessionsAdminService } from './sessions.admin.service';
import { Message } from "@src/common/global-endity/message-entity";
import { RefreshTokenDto } from "@src/sessions/dto/refreshtoken-dto";
import { User } from "@app/common/decorators/getData/getuser-decorator";
import { JwtPayloadUser } from "@src/auth/iterfaces";
import { BadRequestException } from "@nestjs/common";
import { TokenEntity } from "@src/sessions/entity/token-entity";
import { Roles } from "@app/common/decorators/getData/roles-decorator";
import { IdDto } from "@src/common/global-dto/id-dto";
import { TokenUserIdDto } from "@src/admin/sessions.admin/dto/token-userId-dto";

@Resolver()
@Roles("MOOD", "ADMIN", "MODER")
export class SessionsAdminResolver {
    constructor(private readonly sessionsAdminService: SessionsAdminService) {}

    @Mutation(() => Message)
    closeOneSessionAsAdmin(@Args('input') dto: TokenUserIdDto, @User() admin: JwtPayloadUser) {
        try {
            return this.sessionsAdminService.closeOneSessionAsAdmin(dto, admin);
        } catch (error) {
            throw error;
        }
    }

    @Mutation(() => Message)
    closeAllUserSessionAsAdmin(@Args('input') dto: IdDto, @User() admin: JwtPayloadUser) {
        try {
            return this.sessionsAdminService.closeAllUserSessionAsAdmin(dto.id, admin);
        } catch (error) {
            throw error;
        }
    }

    @Query(() => [TokenEntity])
    getAllUserSessionsAsAdmin(@Args('input') dto: IdDto, @User() admin: JwtPayloadUser) {
        try {
            return this.sessionsAdminService.getAllUserSessionsAsAdmin(dto.id, admin);
        } catch (error) {
            throw error;
        }
    }

    @Query(() => [TokenEntity])
    getAllSessionsAsAdmin() {
        try {
            return this.sessionsAdminService.getAllSessionsAsAdmin();
        } catch (error) {
            throw error;
        }
    }
}
