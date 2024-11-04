import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { UsersService } from "src/users/users.service";
import { users as User } from "@prisma/client";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private usersService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'secret', // env.JWT_SECRET
        });
    }

    async validate(payload: any): Promise<User> {
        if (payload.type !== 'access') {
            throw new UnauthorizedException('Access token is required');
        }
        let user: User;
        try {
            user = await this.usersService.findUserById(payload.sub);
        } catch (error) {
            throw new UnauthorizedException('Error fetching user');
        }
        
        // return { iduser: payload.sub, email: payload.email, acces_token: payload.acces_token };
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        return user;
    }
}