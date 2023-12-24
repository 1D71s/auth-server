import { ObjectType, Field } from "@nestjs/graphql"

@ObjectType()
export class UserEntity {
    @Field()
    id: string

    @Field()
    name: string

    @Field()
    email: string

    @Field()
    description: string

    @Field()
    role: string;

    @Field({ nullable: true })
    provider?: string;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}