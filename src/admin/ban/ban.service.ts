import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException
} from "@nestjs/common";
import { PrismaService } from "@src/common/prisma/prisma";
import { BanDto } from "@src/admin/ban/dto/ban-dto";
import { UserService } from "@src/user/user.service";
import { Bans } from "@prisma/client";
import { RolesService } from "@src/admin/roles/roles.service";
import { JwtPayloadUser } from "@src/auth/iterfaces";

@Injectable()
export class BanService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly userService: UserService,
        private readonly roleService: RolesService
    ) {}

    async banUser(dto: BanDto, admin: JwtPayloadUser): Promise<Bans> {

        if (admin.id === dto.userId) {
            throw new BadRequestException();
        }

        const user = await this.userService.getUser(dto.userId);

        if (!user) {
            throw new NotFoundException({ message: 'User is not found!' });
        }

        const checkAccess = this.roleService.checkRoleHierarchy(admin.role, user.role)

        if (!checkAccess) {
            throw new ForbiddenException("No access!")
        }

        const bans = await this.userService.getUserBans(dto.userId)
        const activeBuns = this.checkUserBansByActive(bans)

        if (activeBuns) {
            throw new BadRequestException({ message: "User has another ban!" })
        }

        return this.prisma.bans.create({
            data: {
                userId: dto.userId,
                adminId: admin.id,
                endBan: dto.toDate,
                description: dto.description,
            }
        });
    }

    async deleteBan(banId: string, admin: JwtPayloadUser): Promise<Bans> {

        const ban = await this.getBan(banId)

        if (!ban) {
            throw new NotFoundException("Ban has not found.")
        }

        const userForBan = await this.userService.getUser(ban.userId);
        const checkAccess = this.roleService.checkRoleHierarchy(admin.role, userForBan.role)

        if (!checkAccess) {
            throw new ForbiddenException("No access!")
        }

        return this.prisma.bans.delete({
            where: { banId }
        })
    }

    private getBan(banId: string): Promise<Bans> {
        return this.prisma.bans.findFirst({
            where: { banId }
        })
    }

    checkUserBansByActive(bans: Bans[]): Bans {
        const currentDate = new Date();

        return bans.find((item) => {
            const endBanDate = new Date(item.endBan);
            return endBanDate > currentDate;
        });
    }
}