import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma';
import { genSaltSync, hashSync } from 'bcrypt';
import { UserId } from 'src/auth/endity/userId-endity';
import { User } from '@prisma/client';
import { EditUserDto } from "@src/user/dto/edit-user-dto";


@Injectable()
export class UserService {

    constructor(private readonly prisma: PrismaService) {}
    
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
            throw new NotFoundException('Users are not found!')
        }

        return this.prisma.user.update({
            where: {id: userId},
            data: {
                description: dto?.description,
                name: dto?.name
            }
        })
    }

    async getUser(idOrEmail: string): Promise<User> {

        return this.prisma.user.findFirst({
            where: { 
                OR: [{ id: idOrEmail }, { email: idOrEmail }],
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

    private hashPassword(password: string): string {
        return hashSync(password, genSaltSync(10))
    }
}