import { Request, Response, NextFunction } from 'express';
import { BaseMiddleware } from 'inversify-express-utils';
import { AuthErrorException } from '../utils/exceptions/auth-error.exception';

export class AuthXApiKeyMiddleware extends BaseMiddleware {
    handler(req: Request, res: Response, next: NextFunction) {
        const xApiKey = req.headers['x-api-key'];
        if (!xApiKey) {
            throw AuthErrorException.AUTH_API_KEY_ERROR;
        }
        next();
    }
}
