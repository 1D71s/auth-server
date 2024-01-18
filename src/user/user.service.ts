import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
    UnauthorizedException
} from "@nestjs/common";
import { PrismaService } from 'src/common/prisma/prisma';
import { genSaltSync, hashSync, compareSync } from 'bcrypt';
import { UserId } from 'src/auth/endity/userId-endity';
import { Bans, User } from "@prisma/client";
import { EditUserDto } from "@src/user/dto/edit-user-dto";
import { FullUser } from "@src/user/interfaces";
import { Message } from "@src/common/global-endity/message-endity";
import { ChangePasswordDto } from "@src/user/dto/change-password-dto";
import { UploadsService } from "@src/uploads/uploads.service";
import { Upload } from 'express-fileupload';


@Injectable()
export class UserService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly uploadService: UploadsService
    ) { }
    
    async createUser(dto: Partial<User>): Promise<UserId> {

        const user = await this.getUser(dto.email);

        if (user) {
            throw new ConflictException('this email is used');
        }

        const name = dto.email.split('@')[0];

        const hashPassword = dto?.password ? this.hashPassword(dto.password) : null

        return this.prisma.user.create({
            data: {
                name: dto?.name ? dto.name : name,
                email: dto?.email,
                provider: dto?.provider,
                password: hashPassword
            }
        });
    }

    async editUserInfo(dto: EditUserDto, userId: string): Promise<User> {
        const user = await this.getUser(userId);

        if (!user) {
            throw new NotFoundException({ message: 'User is not found!' });
        }

        return this.prisma.user.update({
            where: {id: userId},
            data: { name: dto?.name }
        })
    }

    async getUser(idOrEmail: string): Promise<FullUser> {
        return this.prisma.user.findFirst({
            where: {
                OR: [{ id: idOrEmail }, { email: idOrEmail }],
            },
            include: {
                sessions: true,
                bans: true
            }
        });
    }

    async getAllUsers(): Promise<User[]> {
        const users = await this.prisma.user.findMany();

        if (users.length === 0) {
            throw new NotFoundException('Users are not found!');
        }

        return users;
    }

    async getUserBans(id: string): Promise<Bans[]> {
        const bans: Bans[] = await this.prisma.bans.findMany({ where: { userId: id } });

        if (!bans) {
            throw new NotFoundException({ message: 'Bans are not found!' });
        }

        return bans;
    }

    async deleteUser(id: string): Promise<Message> {
        const remove = await this.prisma.user.delete({
            where: { id }
        })

        if (!remove) {
            throw new BadRequestException();
        }

        return { success: true, message: "User has been removed." }
    }

    async changePasswordCheck(dto: ChangePasswordDto, userId: string): Promise<Message> {
        const user = await this.getUser(userId);

        if (!user || user.provider || !compareSync(dto.userPassword, user.password)) {
            throw new UnauthorizedException('Wrong password!');
        }

        return this.changePassword(userId, dto.password);
    }

    async changePassword(userId: string, password: string): Promise<Message> {
        const hashPassword = this.hashPassword(password);

        const update = await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashPassword }
        })

        if (!update) {
            throw new BadRequestException();
        }

        return { success: true, message: "Password has been updated." }
    }

    private hashPassword(password: string): string {
        return hashSync(password, genSaltSync(10))
    }

    async changeAvatar(userId: string, file: Upload): Promise<Message> {

        const user = await this.getUser(userId);

        if (user.avatar) {
            await this.uploadService.deleteFile(user.avatar);
        }

        const uploadToStorage = await this.uploadService.uploadImage(file, "avatar");

        if (!uploadToStorage.image) {
            throw new Error("Failed to upload avatar image.");
        }

        await this.prisma.user.update({
            where: { id: userId },
            data: { avatar: uploadToStorage.image }
        })

        return { success: true, message: "Avatar has been updated." };
    }

    async deleteAvatar(userId: string): Promise<Message> {
        const user = await this.getUser(userId);

        if (!user.avatar) {
            throw new BadRequestException("User does not have an avatar to delete.");
        }

        const deleteFromStorage = await this.uploadService.deleteFile(user.avatar);

        if (!deleteFromStorage.success) {
            throw new BadRequestException("Failed to delete avatar image.");
        }

        await this.prisma.user.update({
            where: { id: userId },
            data: { avatar: '' }
        })

        return { success: true, message: "Avatar has been deleted." };
    }
}