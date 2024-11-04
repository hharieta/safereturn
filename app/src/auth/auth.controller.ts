import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { users as User } from '@prisma/client';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Logger } from '@nestjs/common';
import { LogoutInterface } from './interface/logout.interface';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private usersService: UsersService,
    ) {}

    private readonly logger = new Logger(AuthController.name);

    @Post('login')
    async login(@Body() body: LoginDto) {
        const user = await this.authService.validateUser(body.email, body.password);
        return this.authService.login(user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@Request() req: LogoutInterface): Promise<{message: string}> {
        this.logger.log(`User with ID ${req.user.iduser} is logging out`);
        await this.authService.logout(req.user.iduser);

        return { message: 'Logout successful'};
    }

    @Post('refresh')
    async refresh(@Body() body: any): Promise<{access_token: string}> {
        
        const payload = await this.authService.verifyRefreshToken(body.refresh_token);
        const accessToken = await this.authService.generateNewToken(payload);

        return { access_token: accessToken};
    }

    @Post('register')
    async register(@Body() body: RegisterDto): Promise<User> {
        return this.usersService.createUser(body);
    }
}
