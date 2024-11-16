import { Controller,
    Get,
    Post, 
    Put, 
    Delete,
    Request,
    Query,
    UseGuards,
    Body,
    Param
 } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ObjectsService } from './objects.service';
import { objects as ObjectModel } from '@prisma/client';

@Controller('objects')
export class ObjectsController {
    constructor(private objectsService: ObjectsService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async getObjects(@Query('searchString') searchString?: string): Promise<ObjectModel[]> {
        return await this.objectsService.objects({
            where: {
                OR: [
                    { name: { contains: searchString, mode: 'insensitive' } },
                    { description: { contains: searchString, mode: 'insensitive' } },
                    { categories: { categoryname: { contains: searchString, mode: 'insensitive' } } },
                ],
            },
        });
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getObject(@Param('id') id: string): Promise<ObjectModel> {
        return await this.objectsService.object({
            idobject: parseInt(id),
        });
    }
}
