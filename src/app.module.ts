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
import * as process from "process";

@Module({
    imports: [
        UserModule,
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
            context: ({ req, res }) => ({ req, res })
        }),
        AuthModule,
        ConfigModule.forRoot({ isGlobal: true }),
        BanModule,
        RolesModule,
        SessionsModule,
    ],
    controllers: [],
    providers: [
        JwtService,
    ],
})
export class AppModule {}
