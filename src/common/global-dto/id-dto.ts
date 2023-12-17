import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class IdDto {

    @IsString()
    @IsNotEmpty()
    @Field()
    readonly id: string;
}