import { Field, InputType } from "@nestjs/graphql";
import { IsString, MinLength, Validate } from "class-validator";
import { IsPasswordsMatchingConstraint } from "@app/common/decorators/validation/check-passwords";

@InputType()
export class PasswordDto {

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