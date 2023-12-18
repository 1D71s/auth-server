import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { SessionsAdminService } from './sessions.admin.service';
import { Message } from "@src/common/global-endity/message-endity";
import { RefreshTokenDto } from "@src/sessions/dto/refreshtoken-dto";
import { User } from "@app/common/decorators/getData/getuser-decorator";
import { JwtPayloadUser } from "@src/auth/iterfaces";
import { BadRequestException } from "@nestjs/common";
import { TokenEntity } from "@src/sessions/entity/token-entity";
import { Roles } from "@app/common/decorators/getData/roles-decorator";
import { IdDto } from "@src/common/global-dto/id-dto";

@Resolver()
@Roles("MOOD", "ADMIN", "MODER")
export class SessionsAdminResolver {
    constructor(private readonly sessionsAdminService: SessionsAdminService) {}

    @Mutation(() => Message)
    closeOneSessionAsAdmin(@Args('input') dto: RefreshTokenDto, @User() user: JwtPayloadUser) {
        try {
            return this.sessionsAdminService.closeOneSessionAsAdmin();
        } catch (error) {
            throw new BadRequestException("Something went wrong.");
        }
    }

    @Mutation(() => Message)
    closeAllUserSessionAsAdmin(@Args('input') dto: IdDto, @User() user: JwtPayloadUser) {
        try {
            return this.sessionsAdminService.closeAllUserSessionAsAdmin(dto.id, user);
        } catch (error) {
            throw new BadRequestException("Something went wrong.");
        }
    }

    @Query(() => [TokenEntity])
    getAllUserSessionsAsAdmin(@Args('input') dto: IdDto, @User() user: JwtPayloadUser) {
        try {
            return this.sessionsAdminService.getAllUserSessionsAsAdmin(dto.id, user);
        } catch (error) {
            throw new BadRequestException("Something went wrong.");
        }
    }

    @Query(() => [TokenEntity])
    getAllSessionsAsAdmin() {
        try {
            return this.sessionsAdminService.getAllSessionsAsAdmin();
        } catch (error) {
            throw new BadRequestException("Something went wrong.");
        }
    }
}
