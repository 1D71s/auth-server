import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminResolver } from './admin.resolver';
import { UserModule } from "@src/user/user.module";
import { PrismaService } from "@src/common/prisma/prisma";
import { JwtStrategy } from "@src/auth/strategy/jwt-strategy";
import { RolesGuard } from "@src/auth/guards/role-guard";
import { JwtModule } from "@nestjs/jwt";
import { UserService } from "@src/user/user.service";

@Module({
      providers: [UserService ,AdminResolver, AdminService, PrismaService, JwtStrategy, RolesGuard],
      imports: [
          UserModule,
          JwtModule
      ]
})
export class AdminModule {}
