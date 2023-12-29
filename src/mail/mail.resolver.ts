import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { MailService } from "@src/mail/mail.service";

@Resolver()
export class MailResolver {
    constructor(private readonly mailService: MailService) {}
}