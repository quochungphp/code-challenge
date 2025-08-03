/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
export const responseInterceptor = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const originalJson = res.json.bind(res);

    res.json = (body: any): Response => {
        const success = res.statusCode >= 200 && res.statusCode < 300;
        if (
            body &&
            typeof body === 'object' &&
            'success' in body &&
            'data' in body
        ) {
            return originalJson(body);
        }
        return originalJson({ success, data: body });
    };

    next();
};
