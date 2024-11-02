import { Injectable, UnauthorizedException, Request } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { users as User } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ){}

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);

        if ( user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        throw new UnauthorizedException('Invalid credentials');
    }

    async login(user: {iduser: number, email: string}): Promise<{ sub: number; access_token: string; }> {
        return {
            sub: user.iduser,
            access_token: this.jwtService.sign({sub: user.iduser, email: user.email}),
        };
    }


}

