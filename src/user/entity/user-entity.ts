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
	password: string
}