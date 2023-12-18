import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { SessionsService } from './sessions.service';
import { BadRequestException, UseGuards } from "@nestjs/common";
import { Message } from "@src/common/global-endity/message-endity";
import { RefreshTokenDto } from "@src/sessions/dto/refreshtoken-dto";
import { TokenEntity } from "@src/sessions/entity/token-entity";
import { JwtAuthGuard } from "@src/auth/guards/jwt-auth-guard";
import { User } from "@app/common/decorators/getData/getuser-decorator";
import { JwtPayloadUser } from "@src/auth/iterfaces";

@Resolver()
@UseGuards(JwtAuthGuard)
export class SessionsResolver {
    constructor(private readonly sessionsService: SessionsService) {}

    @Mutation(() => Message)
    closeOneSession(@Args('input') dto: RefreshTokenDto, @User() user: JwtPayloadUser) {
        try {
            return this.sessionsService.closeOneSession(dto.token, user.id);
        } catch (error) {
            throw new BadRequestException("Something went wrong.");
        }
    }

    @Mutation(() => Message)
    closeAllUserSession(@User() user: JwtPayloadUser) {
        try {
            return this.sessionsService.closeAllUserSession(user.id);
        } catch (error) {
            throw new BadRequestException("Something went wrong.");
        }
    }

    @Query(() => [TokenEntity])
    getAllSessions(@User() user: JwtPayloadUser) {
        try {
            return this.sessionsService.getAllUserSessions(user.id)
        } catch (error) {
            throw new BadRequestException("Something went wrong.");
        }
    }
}