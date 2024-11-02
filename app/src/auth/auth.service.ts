import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import  { LoginDto } from './dto/login.dto'

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

    async login(user: LoginDto) {
        // console.log('login iduser: '+ user.iduser);
        // const payload = { email: user.email, iduser: user.iduser };
        const payload = { email: user.email, password: user.password };

        return {
            access_token: this.jwtService.sign(payload)
        }
    }


}

