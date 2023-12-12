import { Field, InputType } from '@nestjs/graphql';
import { IsString } from "class-validator";

@InputType()
export class EditUserDto {

    @IsString()
    @Field()
    readonly description: string;

    @IsString()
    @Field()
    readonly name: string;
}
