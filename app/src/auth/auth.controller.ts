import { Controller, Post, Body} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { users as User } from '@prisma/client';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private usersService: UsersService
    ) {}

    @Post('login')
    async login(@Body() body: LoginDto) {
        const user = await this.authService.validateUser(body.email, body.password);
        return this.authService.login(user);
    }

    @Post('register')
    async register(@Body() body: RegisterDto): Promise<User> {
        return this.usersService.createUser(body);
    }
}
