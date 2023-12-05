import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class UserEmail {

    @IsEmail()
    @Field()
    readonly email: string;
}