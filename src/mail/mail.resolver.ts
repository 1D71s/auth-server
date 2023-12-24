import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { MailService } from "@src/mail/mail.service";

@Resolver()
export class MailResolver {
    constructor(private readonly mailService: MailService) {}

    @Mutation(() => Boolean)
    async sendEmail(
        @Args('to') to: string,
        @Args('subject') subject: string,
        @Args('text') text: string,
    ) {
        return this.mailService.sendEmail(to, subject, text);
    }
}