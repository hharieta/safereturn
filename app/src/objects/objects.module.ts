import { Module } from '@nestjs/common';
import { ObjectsService } from './objects.service';
import { ObjectsController } from './objects.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [ObjectsService, PrismaService],
  controllers: [ObjectsController]
})
export class ObjectsModule {}
