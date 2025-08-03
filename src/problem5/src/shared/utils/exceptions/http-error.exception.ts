/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from 'http-status-codes';
export class HttpError extends Error {
    public readonly code: number;
    public readonly message: string;
    public readonly statusCode: StatusCodes;
    public readonly details: any;

    constructor(
        code: number,
        message: string,
        statusCode: number,
        details?: any,
    ) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.message = message;
        this.code = code;

        if (details) {
            this.details = details;
        }
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
