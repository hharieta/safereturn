import { Request } from '@nestjs/common';

export interface LogoutInterface extends Request {
    user: {
        iduser: number;
    };
}
