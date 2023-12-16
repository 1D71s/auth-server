import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesResolver } from './roles.resolver';
import { UserModule } from "@src/user/user.module";
import { PrismaService } from "@src/common/prisma/prisma";

@Module({
    providers: [RolesResolver, RolesService, PrismaService],
    imports: [
        UserModule
    ]
})
export class RolesModule {}
