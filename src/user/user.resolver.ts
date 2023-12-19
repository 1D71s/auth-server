import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserEntity } from './entity/user-entity';
import { UserEmail } from '../auth/dto/user-email';
import { BadRequestException, NotFoundException, UseGuards } from "@nestjs/common";
import { EditUserDto } from "@src/user/dto/edit-user-dto";
import { User } from "@app/common/decorators/getData/getuser-decorator";
import { JwtAuthGuard } from "@src/auth/guards/jwt-auth-guard";
import { JwtPayloadUser } from "@src/auth/iterfaces";
import { BanEntity } from "@src/admin/ban/endity/ban-endity";
import { Message } from "@src/common/global-endity/message-endity";
import { ChangePasswordDto } from "@src/user/dto/change-password-dto";

@Resolver()
export class UserResolver {
    constructor(private readonly userService: UserService) {}

    @Mutation(() => UserEntity)
    @UseGuards(JwtAuthGuard)
    editUserInfo(@Args('input') dto: EditUserDto, @User() user: JwtPayloadUser) {
        try {
            return this.userService.editUserInfo(dto, user.id)
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
    getAllUsers() {
        try {
            return this.userService.getAllUsers();
        } catch (error) {
            throw error;
        }
    }
    @Query(() => [BanEntity])
    @UseGuards(JwtAuthGuard)
    getUserBans(@User() user: JwtPayloadUser) {
        try {
            return this.userService.getUserBans(user.id)
        } catch (error) {
            throw error;
        }
    }

    @Mutation(() => Message)
    @UseGuards(JwtAuthGuard)
    deleteUser(@User() user: JwtPayloadUser) {
        try {
            return this.userService.deleteUser(user.id)
        } catch (error) {
            throw error;
        }
    }

    @Mutation(() => Message)
    @UseGuards(JwtAuthGuard)
    changePassword(@Args('input') dto: ChangePasswordDto, @User() user: JwtPayloadUser) {
        try {
            return this.userService.changePasswordCheck(dto, user.id)
        } catch (error) {
            throw error;
        }
    }
}