import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class IdUserDto {

    @IsString()
    @IsNotEmpty()
    @Field()
    readonly id: string;
}