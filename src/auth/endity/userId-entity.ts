import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserId {
    @Field()
    id: string;
}
