import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from "class-validator";
import { ChangePasswordDto } from "@src/user/dto/change-password-dto";
import { PasswordDto } from "@src/user/dto/password-dto";

@InputType()
export class ChangePasswordAdminDto extends PasswordDto{

    @IsString()
    @IsNotEmpty()
    @Field()
    readonly id: string;
}