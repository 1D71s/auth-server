import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsResolver } from './sessions.resolver';
import { PrismaService } from "@src/common/prisma/prisma";

@Module({
  providers: [SessionsResolver, SessionsService, PrismaService],
})
export class SessionsModule {}
