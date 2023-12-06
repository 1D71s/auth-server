import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AccessToken {

    @Field()
    readonly accessToken: string;
}