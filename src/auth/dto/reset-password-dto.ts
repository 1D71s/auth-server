import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MinLength, Validate } from "class-validator";
import { IsPasswordsMatchingConstraint } from "@app/common/decorators/validation/check-passwords";

@InputType()
export class ResetPasswordDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(32)
    @Field()
    readonly token: string;

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
