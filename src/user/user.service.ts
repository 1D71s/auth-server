import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma';
import { genSaltSync, hashSync } from 'bcrypt';
import { UserId } from 'src/auth/endity/userId-endity';
import { User } from '@prisma/client';


@Injectable()
export class UserService {

    constructor(private readonly prisma: PrismaService) {}
    
    async createUser(dto: Partial<User>): Promise<UserId> {

        console.log(dto)

        const user = await this.getUser(dto.email)

        if (user) {
            throw new ConflictException('this email is used')
        }

        const hashPassword = dto?.password ? this.hashPassword(dto.password) : null

        return this.prisma.user.create({
            data: {
                name: dto?.name,
                email: dto?.email,
                provider: dto?.provider ?? 'GOOGLE',
                password: hashPassword
            }
        });
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
            throw new NotFoundException({ message: 'Users are not found!' });
        }

        return users;
    }

    private hashPassword(password: string) {
        return hashSync(password, genSaltSync(10))
    }
}