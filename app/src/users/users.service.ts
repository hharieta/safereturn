import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { users, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async user(
        userWhereUniqueInput: Prisma.usersWhereUniqueInput,
    ): Promise<users | null> {
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
    }): Promise<users[]> {
        const { skip, take, cursor, where, orderBy } = params;

        return this.prisma.users.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
    }

    async findByEmail(email: string): Promise<users | null> {
        return this.prisma.users.findFirst({
            where: {
                email,
            },
        });
    }

    async createUser(data: Prisma.usersCreateInput): Promise<users> {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        return this.prisma.users.create({
            data: {
                ...data,
                password: hashedPassword,
            },
        });
    }
}
