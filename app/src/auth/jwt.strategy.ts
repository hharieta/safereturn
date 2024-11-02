import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'secret', // env.JWT_SECRET
        });
    }

    async validate(payload: any): Promise<{ iduser: number; email: string; acces_token: string; }> {
        return { iduser: payload.sub, email: payload.email, acces_token: payload.acces_token };
    }
}