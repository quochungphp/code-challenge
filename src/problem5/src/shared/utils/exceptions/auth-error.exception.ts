import { StatusCodes } from 'http-status-codes';
import { HttpError } from './http-error.exception';

export class AuthErrorException extends HttpError {
    static readonly AUTH_API_KEY_ERROR = new HttpError(
        10000,
        'Unauthorized',
        StatusCodes.UNAUTHORIZED,
    );
}
