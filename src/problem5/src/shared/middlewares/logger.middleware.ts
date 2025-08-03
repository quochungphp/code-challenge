import { injectable } from 'inversify';
import { BaseMiddleware } from 'inversify-express-utils';
import express from 'express';
import { winstonLogger } from '../utils/winston-logger';
@injectable()
export class LoggerMiddleware extends BaseMiddleware {
    public async handler(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction,
    ) {
        if (await this.httpContext?.user?.isAuthenticated()) {
            winstonLogger.info(
                `${this.httpContext?.user?.details} => ${req.url}`,
            );
        } else {
            winstonLogger.info(`Request to : ${req.url}`);
        }
        next();
    }
}
