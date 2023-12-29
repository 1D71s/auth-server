import { Module } from '@nestjs/common';
import { AttemptService } from './attempt.service';
import { AttemptResolver } from './attempt.resolver';
import { PrismaService } from "@src/common/prisma/prisma";

@Module({
    providers: [AttemptResolver, AttemptService, PrismaService],
    exports: [
        AttemptService
    ]
})
export class AttemptModule {}
