import { Module } from '@nestjs/common';
import { SessionsAdminService } from './sessions.admin.service';
import { SessionsAdminResolver } from './sessions.admin.resolver';
import { RolesModule } from "@src/admin/roles/roles.module";
import { SessionsModule } from "@src/sessions/sessions.module";
import { PrismaService } from "@src/common/prisma/prisma";
import { UserService } from "@src/user/user.service";
import { SessionsService } from "@src/sessions/sessions.service";

@Module({
    providers: [SessionsAdminResolver, SessionsAdminService, PrismaService, UserService, SessionsService],
    imports: [
        RolesModule,
        SessionsModule
    ]
})
export class SessionsAdminModule {}
