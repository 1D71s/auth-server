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

@Module({
    providers: [AuthResolver, AuthService, PrismaService, GoogleStrategy, GoogleGuard],
    controllers: [AuthController],
    imports: [
        UserModule,
        HttpModule,
        PassportModule,
        ConfigModule.forRoot(),
        JwtModule.register({
            secret: process.env.PRIVATE_KEY || 'SECRET',
            signOptions: {
                expiresIn: '5m'
            }
        })
    ]
})
export class AuthModule {}
