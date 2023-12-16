import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Validate } from "class-validator";
import { Role } from "@prisma/client";
import { CheckRole } from "@app/common/decorators/validation/check-role";
import { RoleDto } from "@src/admin/roles/dto/role-dto";

@InputType()
export class ChangeRoleDto extends RoleDto{

    @IsString()
    @IsNotEmpty()
    @Field()
    readonly id: string;
}
