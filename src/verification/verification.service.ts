import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtPayloadUser } from "@src/auth/iterfaces";
import { PrismaService } from "@src/common/prisma/prisma";
import { MailService } from "@src/mail/mail.service";
import { UserService } from "@src/user/user.service";

@Injectable()
export class VerificationService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly mailService: MailService,
    ) {}

    async sendConfirmCode(user: JwtPayloadUser) {
        try {
            await this.prismaService.emailConfirm.deleteMany({ where: { userId: user.id } });
            const generateCode: string = Array.from({ length: 6 }, () => Math.floor(Math.random() * 9) + 1).join("");
            await this.mailService.sendEmail(user.email, 'EMAIL VERIFICATION CODE', generateCode);

            const expirationDate = new Date();
            expirationDate.setMinutes(expirationDate.getMinutes() + 1);

            await this.prismaService.emailConfirm.create({
                data: {
                    code: generateCode,
                    userId: user.id,
                    exp: expirationDate
                }
            })

            return true
        } catch (error) {
            throw error
        }
    }

    async confirmEmail(code: string, user: JwtPayloadUser) {
        const findCode = await this.prismaService.emailConfirm.findFirst({
            where: {
                code,
                userId: user.id
            }
        })

        if (!findCode || findCode.exp < new Date()) {
            throw new BadRequestException("Invalid or expired confirmation code");
        }

        await this.prismaService.emailConfirm.deleteMany({ where: { userId: user.id } });
        return this.prismaService.user.update({
            where: { id: user.id },
            data: { emailVerify: true }
        })
    }
}
