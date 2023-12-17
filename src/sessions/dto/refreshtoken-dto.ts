import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class RefreshTokenDto {

    @IsString()
    @IsNotEmpty()
    @Field()
    readonly token: string;
}
