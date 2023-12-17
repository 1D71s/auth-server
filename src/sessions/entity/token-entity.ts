import { ObjectType, Field } from "@nestjs/graphql"

@ObjectType()
export class TokenEntity {
    @Field()
    token: string;

    @Field()
    exp: Date;

    @Field()
    userId: string;

    @Field()
    user_agent: string;
}