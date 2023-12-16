import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Validate } from "class-validator";
import { CheckRole } from "@app/common/decorators/validation/check-role";

@InputType()
export class RoleDto {

    @IsString()
    @IsNotEmpty()
    @Validate(CheckRole)
    @Field()
    readonly role: string;
}