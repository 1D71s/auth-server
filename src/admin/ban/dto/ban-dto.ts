import { Field, InputType } from '@nestjs/graphql';
import { IsDate, IsString } from "class-validator";

@InputType()
export class BanDto {

    @IsString()
    @Field()
    readonly userId: string;

    @IsString()
    @Field()
    readonly description: string;

    @IsDate()
    @Field()
    readonly toDate: Date;
}