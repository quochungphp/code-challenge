/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import { injectable } from 'inversify';
import { HttpError } from '../utils/exceptions/http-error.exception';

@injectable()
export class ErrorHandlerMiddleware {
    handle(err: Error, req: Request, res: Response, next: NextFunction): any {
        if (err instanceof HttpError) {
            return res.status(err.statusCode).json({
                message: err.message,
                details: err.details || null,
            });
        }

        res.status(500).json({
            message: 'Internal Server Error',
        });
    }
}
