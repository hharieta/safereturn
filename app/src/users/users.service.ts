import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { users as User, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async user(
        userWhereUniqueInput: Prisma.usersWhereUniqueInput,
    ): Promise<User | null> {
        return this.prisma.users.findUnique({
            where: userWhereUniqueInput,
        });
    }

    async users(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.usersWhereUniqueInput;
        where?: Prisma.usersWhereInput;
        orderBy?: Prisma.usersOrderByWithRelationInput;
    }): Promise<User[]> {
        const { skip, take, cursor, where, orderBy } = params;

        return this.prisma.users.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.prisma.users.findUnique({
            where: {
                email: email,
            },
        });
    }

    async findUserById(iduser: number): Promise<User | null> {
        return this.prisma.users.findUnique({
            where: {
                iduser: iduser,
            },
        });
    }

    async createUser(data: Prisma.usersCreateInput): Promise<User> {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        return this.prisma.users.create({
            data: {
                ...data,
                password: hashedPassword,
            },
        });
    }
}
