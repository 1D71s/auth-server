import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsNotEmpty, IsString } from "class-validator";

@InputType()
export class BanDto {

    @IsString()
    @IsNotEmpty()
    @Field()
    readonly userId: string;

    @IsString()
    @IsNotEmpty()
    @Field()
    readonly description: string;

    @IsDate()
    @IsNotEmpty()
    @Field()
    readonly toDate: Date;
}