import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersService } from './users/users.service';
import { AuthModule } from './auth/auth.module';
import { ObjectsModule } from './objects/objects.module';

@Module({
  imports: [PrismaModule, AuthModule, ObjectsModule],
  controllers: [AppController],
  providers: [AppService, UsersService],
})
export class AppModule {}
