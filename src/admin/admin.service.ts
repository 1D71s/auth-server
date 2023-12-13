import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@src/common/prisma/prisma";
import { User } from "@prisma/client";
import { UserEntity } from "@src/user/entity/user-entity";

@Injectable()
export class AdminService {
    constructor(private readonly prisma: PrismaService) {}

    async banUser(id: string, isBlock: boolean): Promise<UserEntity> {
        const user = await this.prisma.user.update({
            where: { id }, data: { isBlocked: isBlock }
        })

        if (!user) {
            throw new NotFoundException({ message: 'User is not found!' });
        }

        return user;
    }
}
