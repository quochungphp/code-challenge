/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
export const responseInterceptor = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const originalSend = res.send;

    res.send = (body: any): Response => {
        const success = res.statusCode >= 200 && res.statusCode < 300;
        const formattedResponse = { data: body, success };
        return originalSend.call(res, JSON.stringify(formattedResponse));
    };
    next();
};
