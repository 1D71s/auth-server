import { Module } from '@nestjs/common';
import { UserAdminService } from './user.admin.service';
import { UserAdminResolver } from './user.admin.resolver';
import { UserModule } from "@src/user/user.module";
import { RolesModule } from "@src/admin/roles/roles.module";

@Module({
    providers: [UserAdminResolver, UserAdminService],
    imports: [
        UserModule,
        RolesModule
    ]
})
export class UserAdminModule {}
