import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@src/common/prisma/prisma";
import { BanDto } from "@src/admin/ban/dto/ban-dto";
import { UserService } from "@src/user/user.service";
import { Bans } from "@prisma/client";

@Injectable()
export class BanService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly userService: UserService
    ) {}

    async banUser(dto: BanDto, admin: string): Promise<Bans> {

        if (admin === dto.userId) {
            throw new BadRequestException();
        }

        const user = await this.userService.getUser(dto.userId);

        if (!user) {
            throw new NotFoundException({ message: 'User is not found!' });
        }

        const bans = await this.userService.getUserBans(dto.userId)
        const activeBuns = this.checkUserBansByActive(bans)

        if (activeBuns) {
            throw new BadRequestException({ message: "User has another ban!" })
        }

        return this.prisma.bans.create({
            data: {
                userId: dto.userId,
                adminId: admin,
                endBan: dto.toDate,
                description: dto.description,
            }
        });
    }

    checkUserBansByActive(bans: Bans[]): Bans {
        const currentDate = new Date();

        return bans.find((item) => {
            const endBanDate = new Date(item.endBan);
            return endBanDate > currentDate;
        });
    }
}