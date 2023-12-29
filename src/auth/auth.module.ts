import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from "@nestjs/jwt";
import { PrismaService } from '@src/common/prisma/prisma';
import { AuthController } from './auth.controller';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './strategy/google-strategy';
import { ConfigModule } from '@nestjs/config';
import { GoogleGuard } from "@src/auth/guards/google-auth.guard";
import { JwtStrategy } from "@src/auth/strategy/jwt-strategy";
import { RolesGuard } from "@src/auth/guards/role-guard";
import { UserService } from "@src/user/user.service";
import { BanModule } from "@src/admin/ban/ban.module";
import { BanService } from "@src/admin/ban/ban.service";
import { RolesModule } from "@src/admin/roles/roles.module";
import { AttemptModule } from "@src/attempt/attempt.module";

@Module({
    providers: [
        UserService,
        AuthResolver,
        AuthService,
        PrismaService,
        GoogleStrategy,
        GoogleGuard,
        JwtStrategy,
        RolesGuard,
        BanService
    ],
    controllers: [AuthController],
    imports: [
        RolesModule,
        UserModule,
        HttpModule,
        PassportModule,
        BanModule,
        AttemptModule,
        ConfigModule.forRoot(),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: {
                expiresIn: '5m'
            }
        })
    ]
})
export class AuthModule {}
