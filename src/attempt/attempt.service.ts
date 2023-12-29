import { Injectable } from '@nestjs/common';
import { PrismaService } from "@src/common/prisma/prisma";
import { AttemptTypes } from "@src/attempt/interfaces";

@Injectable()
export class AttemptService {
    constructor(private readonly prisma: PrismaService) {}

    async save(input: AttemptTypes) {}

    async remove(input: AttemptTypes) {}

    async check(input: AttemptTypes) {}
}
