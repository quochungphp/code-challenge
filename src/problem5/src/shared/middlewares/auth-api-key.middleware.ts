import { Request, Response, NextFunction } from 'express';
import { BaseMiddleware } from 'inversify-express-utils';
import { AuthErrorException } from '../utils/exceptions/auth-error.exception';
import { inject } from 'inversify';
import { TYPES } from '../../bootstrap-type';
import { ConfigEnv } from '../../config/config.env';

export class AuthXApiKeyMiddleware extends BaseMiddleware {
    constructor(@inject(TYPES.ConfigEnv) private configEnv: ConfigEnv) {
        super();
    }

    handler(req: Request, res: Response, next: NextFunction) {
        const xApiKey = req.headers['x-api-key'];

        if (!xApiKey || xApiKey !== this.configEnv.xApiKey) {
            throw AuthErrorException.AUTH_API_KEY_ERROR;
        }

        next();
    }
}
