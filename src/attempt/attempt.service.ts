import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "@src/common/prisma/prisma";
import { AttemptTypes } from "@src/attempt/interfaces";
import { Attempt } from "@prisma/client";

@Injectable()
export class AttemptService {
    constructor(private readonly prisma: PrismaService) {}

    async check(input: AttemptTypes): Promise<void> {
        const attempt = await this.checkAttempts(input);

        if (attempt && attempt.count >= 3 && attempt.exp > new Date()) {
            const timeDifferenceInSeconds = attempt && Math.floor((attempt.exp.getTime() - new Date().getTime()) / 1000);
            throw new UnauthorizedException(`Exceeded the maximum attempts. Please try again in ${timeDifferenceInSeconds}s.`);
        }

        await this.save(input);
    }

    async remove(input: AttemptTypes): Promise<any> {
        return this.prisma.attempt.deleteMany({
            where: {
                userId: input.userId,
                UserAgent: input.user_agent,
                where: input.where
            }
        })
    }

    private async save(input: AttemptTypes): Promise<Attempt> {
        const expirationDate = new Date();
        expirationDate.setMinutes(expirationDate.getMinutes() + 1);

        const attempt = await this.checkAttempts(input);

        if (attempt) {
            return this.prisma.attempt.update({
                where: { id: attempt.id },
                data: {
                    userId: input.userId,
                    UserAgent: input.user_agent,
                    where: input.where,
                    exp: expirationDate,
                    count: attempt.count + 1
                }
            })
        }

        return this.prisma.attempt.create({
            data: {
                userId: input.userId,
                UserAgent: input.user_agent,
                where: input.where,
                exp: expirationDate,
            }
        })
    }

    private async checkAttempts(input: AttemptTypes): Promise<Attempt> {
        return this.prisma.attempt.findFirst({
            where: {
                userId: input.userId,
                UserAgent: input.user_agent,
                where: input.where
            }
        })
    }
}