import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Message {

    @Field()
    readonly success: boolean;

    @Field()
    readonly message: string;
}