import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { VerificationResolver } from './verification.resolver';
import { PrismaService } from "@src/common/prisma/prisma";
import { MailModule } from "@src/mail/mail.module";
import { UserModule } from "@src/user/user.module";

@Module({
    providers: [VerificationResolver, VerificationService, PrismaService],
    imports: [
        MailModule,
    ]
})
export class VerificationModule {}
