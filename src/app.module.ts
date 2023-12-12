import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from './admin/admin.module';
import { JwtModule, JwtService } from "@nestjs/jwt";
import * as process from "process";
import { APP_GUARD } from "@nestjs/core";
import { RolesGuard } from "@src/auth/guards/roles-guard";

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
        AdminModule,
    ],
    controllers: [],
    providers: [
        JwtService,
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
    ],
})
export class AppModule {}
