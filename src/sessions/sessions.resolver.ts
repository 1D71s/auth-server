import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { SessionsService } from './sessions.service';
import { IdUserDto } from "@src/user/dto/id-user-dto";
import { BadRequestException, UseGuards } from "@nestjs/common";
import { Message } from "@src/common/global-endity/message-endity";
import { RefreshTokenDto } from "@src/sessions/dto/refreshtoken-dto";
import { TokenEntity } from "@src/sessions/entity/token-entity";
import { JwtAuthGuard } from "@src/auth/guards/jwt-auth-guard";

@Resolver()
@UseGuards(JwtAuthGuard)
export class SessionsResolver {
    constructor(private readonly sessionsService: SessionsService) {}

    @Mutation(() => Message)
    closeOneSession(@Args('input') dto: RefreshTokenDto) {
        try {
            return this.sessionsService.closeOneSession(dto);
        } catch (error) {
            throw new BadRequestException("Something went wrong.");
        }
    }

    @Mutation(() => Message)
    closeAllUserSession(@Args('input') dto: IdUserDto) {
        try {
            return this.sessionsService.closeAllUserSession(dto);
        } catch (error) {
            throw new BadRequestException("Something went wrong.");
        }
    }

    @Query(() => [TokenEntity])
    getAllSessions(@Args('input') dto: IdUserDto) {
        try {
            return this.sessionsService.getAllSessions(dto)
        } catch (error) {
            throw new BadRequestException("Something went wrong.");
        }
    }
}