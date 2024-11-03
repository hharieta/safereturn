import { Request } from 'express';

export interface LogoutInterface extends Request {
    user: {
        iduser: number;
    };
}
