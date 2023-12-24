import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MinLength, Validate } from "class-validator";

@InputType()
export class CodeDto {

    @IsString()
    @MinLength(6)
    @Field()
    readonly code: string;
}