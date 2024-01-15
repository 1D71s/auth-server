import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class KeyFileDto {

    @IsString()
    @Field()
    @IsNotEmpty()
    readonly key: string;
}
