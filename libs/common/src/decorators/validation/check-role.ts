import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { ChangeRoleDto } from "@src/admin/roles/dto/change-role-dto";
import { Role } from "@prisma/client";

@ValidatorConstraint({ name: 'CheckRole', async: false })
export class CheckRole implements ValidatorConstraintInterface {
    validate(role: string, args: ValidationArguments) {
        const obj = args.object as ChangeRoleDto;
        return obj.role in Role;
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return 'This role does not exist.';
    }
}