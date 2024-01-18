import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { PrismaService } from 'src/common/prisma/prisma';
import { JwtModule } from "@nestjs/jwt";
import { UserController } from './user.controller';
import { UploadsService } from '@src/uploads/uploads.service';

@Module({
    providers: [UserResolver, UserService, PrismaService, UploadsService],
    controllers: [UserController],
    imports: [
        JwtModule,
    ],
    exports: [
        UserService,
    ]
})
export class UserModule {}
