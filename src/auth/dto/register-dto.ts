import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MinLength, Validate } from "class-validator";
import { UserEmail } from './user-email';
import { IsPasswordsMatchingConstraint } from "@app/common/decorators/validation/check-passwords";

@InputType()
export class RegisterDto extends UserEmail {

    @IsString()
    @IsNotEmpty()
    @Field()
    readonly name: string;

    @IsString()
    @MinLength(6)    
    @Field()
    readonly password: string;

    @IsString()
    @MinLength(6)
    @Validate(IsPasswordsMatchingConstraint)
    @Field()
    readonly passwordRepeat: string;
}
