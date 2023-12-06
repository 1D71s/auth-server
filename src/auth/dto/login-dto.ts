import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MinLength, Validate } from "class-validator";
import { UserEmail } from './user-email';

@InputType()
export class LoginDto extends UserEmail {

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    @Field()
    readonly email: string;

    @IsString()
    @MinLength(6)
    @Field()
    readonly password: string;
}
