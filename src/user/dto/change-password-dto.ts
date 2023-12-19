import { Field, InputType } from "@nestjs/graphql";
import { UserEmail } from "@src/auth/dto/user-email";
import { IsNotEmpty, IsString, MinLength, Validate } from "class-validator";
import { IsPasswordsMatchingConstraint } from "@app/common/decorators/validation/check-passwords";

@InputType()
export class ChangePasswordDto {

    @IsString()
    @IsNotEmpty()
    @Field()
    readonly userPassword: string;

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