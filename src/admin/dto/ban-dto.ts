import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class BanDto {

    @Field()
    readonly id: string;

    @Field()
    readonly isBlock: boolean;
}
