import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from "@nestjs/jwt";
import { BanModule } from '@src/admin/ban/ban.module';
import { RolesModule } from '@src/admin/roles/roles.module';
import { SessionsModule } from './sessions/sessions.module';
import { SessionsAdminModule } from '@src/admin/sessions.admin/sessions.admin.module';
import { UserAdminModule } from '@src/admin/user.admin/user.admin.module';
import { MailModule } from './mail/mail.module';
import { VerificationModule } from './verification/verification.module';
import { AttemptModule } from './attempt/attempt.module';
import { UploadsModule } from './uploads/uploads.module';
import * as process from "process";
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';


@Module({
    imports: [
        UserModule,
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
            context: ({ req, res }) => ({ req, res }),
        }),
        MulterModule.register({
            storage: memoryStorage(),
        }),
        AuthModule,
        ConfigModule.forRoot({ isGlobal: true }),
        BanModule,
        RolesModule,
        SessionsModule,
        SessionsAdminModule,
        UserAdminModule,
        MailModule,
        VerificationModule,
        AttemptModule,
        UploadsModule,
    ],
    controllers: [],
    providers: [
        JwtService,
    ],
})
export class AppModule {}
