import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@src/common/prisma/prisma";
import { Token } from "@prisma/client";
import { Message } from "@src/common/global-endity/message-entity";

@Injectable()
export class SessionsService {
    constructor(private readonly prisma: PrismaService) {}

    async closeOneSession(token: string, userId: string): Promise<Message> {
        const session = await this.getOneUserSession(token, userId);

        if (!session) {
            throw new NotFoundException("Session has not found.");
        }

        const remove = await this.prisma.token.delete({
            where: { token, userId }
        })

        if (!remove) {
            throw new BadRequestException();
        }

        return { success: true, message: "Session has been removed." }
    }

    async closeAllUserSession(userId: string): Promise<Message> {
        const userSessions = await this.getAllUserSessions(userId);

        if (!userSessions.length) {
            throw new NotFoundException("User has not sessions.");
        }

        const remove = await this.prisma.token.deleteMany({
            where: { userId: userId as string }
        })

        if (!remove) {
            throw new BadRequestException();
        }

        return { success: true, message: `${remove.count} sessions has been removed.` }
    }

    async getOneUserSession(token: string, userId: string): Promise<Token> {
        return this.prisma.token.findFirst({
            where: { token, userId }
        })
    }

    async getAllUserSessions(userId: string): Promise<Token[]> {
        return this.prisma.token.findMany({
            where: { userId }
        })
    }
}