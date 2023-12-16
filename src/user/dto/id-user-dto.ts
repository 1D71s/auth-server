import { Field, InputType } from '@nestjs/graphql';
import { IsString } from "class-validator";

@InputType()
export class IdUserDto {

    @IsString()
    @Field()
    readonly id: string;
}