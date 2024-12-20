import { Controller, Get, Request, UseGuards, Body, Post } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { users as User } from '@prisma/client';


@ApiTags('users')
@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Request() req: {user: User}): Promise<User> {
        const email = req.user.email;
        return this.usersService.findByEmail(email);

    }

    // @Post('register')
    // async register(@Body() body: User) {
    //     return this.usersService.createUser(body);
    // }
}
