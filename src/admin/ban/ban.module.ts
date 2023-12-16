import { Module } from '@nestjs/common';
import { BanService } from './ban.service';
import { BanResolver } from './ban.resolver';
import { PrismaService } from "@src/common/prisma/prisma";
import { UserModule } from "@src/user/user.module";

@Module({
    providers: [BanResolver, BanService, PrismaService],
    imports: [
        UserModule
    ]
})
export class BanModule {}
