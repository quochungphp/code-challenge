/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject } from 'inversify';
import {
    controller,
    BaseHttpController,
    httpPost,
    request,
    withMiddleware,
} from 'inversify-express-utils';
import { TYPES } from '../../bootstrap-type';
import { StatusCodes } from 'http-status-codes';
import { UserRegisterHandler } from './handlers/user-register.handler';
import { LoggerService } from '../../shared/services/logger.service';
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User Controller
 */
@controller('/users')
export class UserController extends BaseHttpController {
    constructor(
        @inject(TYPES.LoggerService) private loggerService: LoggerService,
        @inject(TYPES.UserRegisterHandler)
        private userRegisterHandler: UserRegisterHandler,
    ) {
        super();
    }
    /**
     * @swagger
     * /users/register:
     *   post:
     *     summary: Register a new user
     *     tags: [Users]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateUserDto'
     *     responses:
     *       201:
     *         description: User created successfully
     *       400:
     *         description: Invalid input
     */
    @httpPost('/register')
    @withMiddleware(TYPES.AuthXApiKeyMiddleware)
    public async registerUser(@request() req: Request) {
        try {
            const user = await this.userRegisterHandler.registerAsync(req.body);
            return this.json(user, StatusCodes.CREATED);
        } catch (error: any) {
            this.loggerService.error('UserController.registerUser error:', error);
            return this.json(error, StatusCodes.BAD_REQUEST);
        }
    }
}
