import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsResolver } from './sessions.resolver';
import { PrismaService } from "@src/common/prisma/prisma";
import { UserModule } from "@src/user/user.module";
import { RolesModule } from "@src/admin/roles/roles.module";

@Module({
    providers: [SessionsResolver, SessionsService, PrismaService],
    imports: [
        UserModule,
        RolesModule
    ]
})
export class SessionsModule {}
