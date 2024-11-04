import { Injectable, UnauthorizedException, Request } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '../redis/redis.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private RedisService: RedisService
    ){}

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);

        if ( user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        throw new UnauthorizedException('Invalid credentials');
    }

    async login(user: {iduser: number, email: string}): Promise<{ sub: number; access_token: string; refresh_token: string }> {
        const accessToken = this.jwtService.sign({sub: user.iduser, email: user.email, type: 'access'}, {expiresIn: '1h'});
        const refreshToken = this.jwtService.sign({sub: user.iduser, email: user.email, type: 'refresh'}, {expiresIn: '8h'});

        await this.saveRefreshToken(refreshToken, user);
        return {
            sub: user.iduser,
            access_token: accessToken,
            refresh_token: refreshToken
        };
    }

    async logout(iduser: number): Promise<void> {
        await this.deleteRefreshToken(iduser);
    }

    async verifyRefreshToken(token: string): Promise<any> {
        try {
            const decoded = this.jwtService.verify(token);
            if (decoded.type !== 'refresh') {
                throw new UnauthorizedException('Refresh token is required');
            }

            const storedToken = await this.getRefreshToken(decoded.sub);
            if (token !== storedToken) {
                throw new UnauthorizedException('Invalid token');
            }
            return decoded;
        } catch (e) {
            throw new UnauthorizedException('Invalid token');
        }
    }

    async generateNewToken(payload: {sub: number, email: string}): Promise<string> {
        return this.jwtService.sign(
            { sub: payload.sub, email: payload.email, type: 'access' },
            { expiresIn: '1h' }
          );
    }

    async saveRefreshToken(refreshToken: string, user: {iduser: number, email: string}): Promise<void> {
        await this.RedisService.getClient().set(`refreshToken:${user.iduser}`, refreshToken, 'EX', 8 * 60 * 60); // 8 horas
    }

    async getRefreshToken(iduser: number): Promise<string | null> {
        return this.RedisService.getClient().get(`refreshToken:${iduser}`);
    }
    
    async deleteRefreshToken(iduser: number): Promise<void> {
        await this.RedisService.getClient().del(`refreshToken:${iduser}`);
    }

}

