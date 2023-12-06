import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma';
import { RegisterDto } from '../auth/dto/register-dto';
import { genSaltSync, hashSync } from 'bcrypt';
import { UserId } from 'src/auth/endity/userId-endity';
import { User } from '@prisma/client';


@Injectable()
export class UserService {

    constructor(private readonly prisma: PrismaService) {}
    
    async createUser(dto: RegisterDto): Promise<UserId> {
        const user = await this.getUser(dto.email)

        if (user) {
            throw new ConflictException('this email is used')
        }

        const hashPassword = await this.hashPassword(dto.password)

        return this.prisma.user.create({
            data: {
                name: dto.name,
                email: dto.email,
                password: hashPassword
            }
        });
    }

    async editUserInfo() {}

    async getUser(email: string): Promise<User> {
        const user = await this.prisma.user.findFirst({
            where: { email }
        });

        return user
    }

    async getAllUsers(): Promise<User[]> {
        const users = await this.prisma.user.findMany();

        if (users.length === 0) {
            throw new NotFoundException({ message: 'Users are not found!' });
        }

        return users;
    }

    private hashPassword(password: string) {
        return hashSync(password, genSaltSync(10))
    }
}
