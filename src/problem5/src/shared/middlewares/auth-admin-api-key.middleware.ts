import { Request, Response, NextFunction } from 'express';
import { BaseMiddleware } from 'inversify-express-utils';
import { AuthErrorException } from '../utils/exceptions/auth-error.exception';
import { inject } from 'inversify';
import { TYPES } from '../../bootstrap-type';
import { ConfigEnv } from '../../config/config.env';

export class AuthXAdminApiKeyMiddleware extends BaseMiddleware {
    constructor(@inject(TYPES.ConfigEnv) private configEnv: ConfigEnv) {
        super();
    }

    handler(req: Request, res: Response, next: NextFunction) {
        const xAdminApiKey = req.headers['x-admin-api-key'];

        if (!xAdminApiKey || xAdminApiKey !== this.configEnv.xAdminApiKey) {
            throw AuthErrorException.AUTH_API_KEY_ERROR;
        }

        next();
    }
}
