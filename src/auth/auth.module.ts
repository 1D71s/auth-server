import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from "@nestjs/jwt";
import { PrismaService } from '@src/common/prisma/prisma';

@Module({
    providers: [AuthResolver, AuthService, PrismaService],
    imports: [
        UserModule,
        JwtModule.register({
            secret: process.env.PRIVATE_KEY || 'SECRET',
            signOptions: {
                expiresIn: '5m'
            }
        })
    ]
})
export class AuthModule {}
