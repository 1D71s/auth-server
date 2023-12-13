import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserEntity } from './entity/user-entity';
import { UserEmail } from '../auth/dto/user-email';
import { NotFoundException } from "@nestjs/common";
import { EditUserDto } from "@src/user/dto/edit-user-dto";

@Resolver()
export class UserResolver {
    constructor(private readonly userService: UserService) {}

    @Mutation(() => UserEntity)
    async editUserInfo(@Args('input') dto: EditUserDto) {
        try {
            return this.userService
        } catch (error) {
            throw error;
        }
    }

    @Query(() => UserEntity)
    async getUser(@Args('input') dto: UserEmail) {
        try {
            const user = await this.userService.getUser(dto.email);

            if (!user) {
                throw new NotFoundException({ message: 'User is not found!' });
            }

            return user
        } catch (error) {
            throw error;
        }
    }

    @Query(() => [UserEntity])
    async getAllUsers() {
        try {
            return await this.userService.getAllUsers();
        } catch (error) {
            throw error;
        }
    }
}
