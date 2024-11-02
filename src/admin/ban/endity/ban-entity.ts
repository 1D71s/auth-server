import { ObjectType, Field } from "@nestjs/graphql"

@ObjectType()
export class BanEntity {
    @Field()
    banId: string

    @Field()
    userId: string

    @Field()
    adminId: string

    @Field()
    endBan: Date

    @Field()
    description: string
}