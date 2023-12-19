import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString, MinLength, Validate } from "class-validator";
import { IsPasswordsMatchingConstraint } from "@app/common/decorators/validation/check-passwords";
import { PasswordDto } from "@src/user/dto/password-dto";

@InputType()
export class ChangePasswordDto extends PasswordDto {

    @IsString()
    @IsNotEmpty()
    @Field()
    readonly userPassword: string;
}