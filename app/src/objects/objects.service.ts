import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { objects as Object, Prisma } from '@prisma/client';
import { images as Image } from '@prisma/client';

@Injectable()
export class ObjectsService {
    constructor(private prisma: PrismaService) {}


    async object(
        objectWhereUniqueInput: Prisma.objectsWhereUniqueInput,
    ): Promise<Object | null> {
        return this.prisma.objects.findUnique({
            where: objectWhereUniqueInput,
            include: (
                {
                    images: true,

                }
            )
        });
    }

    async objects (params?: {
        skip?: number;
        take?: number;
        cursor?: Prisma.objectsWhereUniqueInput;
        where?: Prisma.objectsWhereInput;
        orderBy?: Prisma.objectsOrderByWithRelationInput;
    }): Promise<Object[]> {
        const { skip, take, cursor, where, orderBy } = params;

        return this.prisma.objects.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
            include: (
                {
                    images: true,
                    founds: true,
                    returneds: true,
                }
            )
        });
    }

    async createObject(data: Prisma.objectsCreateInput): Promise<Object> {
        return this.prisma.objects.create({
            data: data,
        });
    }
}
