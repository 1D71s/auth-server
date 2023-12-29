import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { VerificationResolver } from './verification.resolver';
import { PrismaService } from "@src/common/prisma/prisma";
import { MailModule } from "@src/mail/mail.module";
import { UserModule } from "@src/user/user.module";
import { AttemptModule } from "@src/attempt/attempt.module";

@Module({
    providers: [VerificationResolver, VerificationService, PrismaService],
    imports: [
        MailModule,
        AttemptModule
    ]
})
export class VerificationModule {}
