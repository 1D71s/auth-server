import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@src/common/prisma/prisma";
import { IdUserDto } from "@src/user/dto/id-user-dto";
import { Token } from "@prisma/client";
import { Message } from "@src/common/global-endity/message-endity";
import { RefreshTokenDto } from "@src/sessions/dto/refreshtoken-dto";

@Injectable()
export class SessionsService {

    constructor(private readonly prisma: PrismaService) {}

    async closeOneSession(dto: RefreshTokenDto): Promise<Message> {
        const session = await this.getOneUserSession(dto);

        if (!session) {
            throw new NotFoundException("Session has not found.");
        }

        const remove = await this.prisma.token.delete({
            where: { token: dto.token }
        })

        if (!remove) {
            throw new BadRequestException()
        }

        return { success: true, message: "Session has been removed." }
    }

    async closeAllUserSession(dto: IdUserDto): Promise<Message> {
        const userSessions = await this.getAllSessions(dto);

        if (!userSessions) {
            throw new NotFoundException("User has not sessions.");
        }

        const remove = await this.prisma.token.deleteMany({
            where: { userId: dto.id }
        })

        if (!remove) {
            throw new BadRequestException()
        }

        return { success: true, message: "Sessions has been removed." }
    }

    async getOneUserSession(dto: RefreshTokenDto): Promise<Token> {
        return this.prisma.token.findFirst({
            where: { token: dto.token }
        })
    }

    async getAllSessions(dto: IdUserDto): Promise<Token[]> {
        return this.prisma.token.findMany({
            where: { userId: dto.id }
        })
    }
}