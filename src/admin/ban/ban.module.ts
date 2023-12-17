import { Module } from '@nestjs/common';
import { BanService } from './ban.service';
import { BanResolver } from './ban.resolver';
import { PrismaService } from "@src/common/prisma/prisma";
import { UserModule } from "@src/user/user.module";
import { RolesModule } from "@src/admin/roles/roles.module";
import { UserService } from "@src/user/user.service";
import { RolesService } from "@src/admin/roles/roles.service";

@Module({
    providers: [BanResolver, BanService, PrismaService],
    imports: [
        UserModule,
        RolesModule
    ]
})
export class BanModule {}
