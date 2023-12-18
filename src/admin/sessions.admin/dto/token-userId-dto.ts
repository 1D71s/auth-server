import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from "class-validator";
import { IdDto } from "@src/common/global-dto/id-dto";

@InputType()
export class TokenUserIdDto extends IdDto {

    @IsString()
    @IsNotEmpty()
    @Field()
    readonly token: string;
}