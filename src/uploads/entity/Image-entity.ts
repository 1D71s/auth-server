import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ImageEntity {

    @Field()
    readonly image: string;
}