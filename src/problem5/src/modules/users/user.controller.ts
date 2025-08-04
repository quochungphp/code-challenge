/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject } from 'inversify';
import {
    controller,
    BaseHttpController,
    httpPost,
    httpDelete,
    httpGet,
    request,
    requestParam,
    withMiddleware,
    httpPut,
    queryParam,
} from 'inversify-express-utils';
import { TYPES } from '../../bootstrap-type';
import { StatusCodes } from 'http-status-codes';
import { LoggerService } from '../../shared/services/logger.service';
import { UserRegisterHandler } from './handlers/user-register.handler';
import { UserDeleteHandler } from './handlers/user-delete.handler';
import { UserUpdateHandler } from './handlers/user-update.handler';
import { UserInfoHandler } from './handlers/user-info.handler';
import { GetUsersQuerySchema } from './types/user.dto';
import { UserListHandler } from './handlers/user-list.handler';

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
        @inject(TYPES.UserDeleteHandler)
        private userDeleteHandler: UserDeleteHandler,
        @inject(TYPES.UserUpdateHandler)
        private userUpdateHandler: UserUpdateHandler,
        @inject(TYPES.UserInfoHandler)
        private userInfoHandler: UserInfoHandler,
        @inject(TYPES.UserListHandler)
        private userListHandler: UserListHandler,
    ) {
        super();
    }

    /**
     * @swagger
     * /users:
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
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/UserRegisterResponseDto'
     *       400:
     *         description: Invalid input
     */
    @httpPost('/')
    @withMiddleware(TYPES.AuthXApiKeyMiddleware)
    public async registerUser(@request() req: Request) {
        try {
            const user = await this.userRegisterHandler.registerAsync(req.body);
            return this.json(user, StatusCodes.CREATED);
        } catch (error: any) {
            this.loggerService.error(
                'UserController.registerUser error:',
                error,
            );
            return this.json(error, StatusCodes.BAD_REQUEST);
        }
    }

    /**
     * @swagger
     * /users/{id}:
     *   delete:
     *     summary: Delete a user by ID
     *     tags: [Users]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: User deleted successfully
     *       404:
     *         description: User not found
     */
    @httpDelete('/:id')
    @withMiddleware(TYPES.AuthXAdminApiKeyMiddleware)
    public async deleteUser(@requestParam('id') id: string) {
        try {
            await this.userDeleteHandler.deleteAsync(id);
            return this.json({ message: 'User deleted' }, StatusCodes.OK);
        } catch (error: any) {
            this.loggerService.error('UserController.deleteUser error:', error);
            return this.json(error, error.status || StatusCodes.BAD_REQUEST);
        }
    }

    /**
     * @swagger
     * /users/{id}:
     *   patch:
     *     summary: Update a user by ID
     *     tags: [Users]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateUserDto'
     *     responses:
     *       200:
     *         description: User updated successfully
     */
    @httpPut('/:id')
    @withMiddleware(TYPES.AuthXApiKeyMiddleware)
    public async updateUser(
        @requestParam('id') id: string,
        @request() req: Request,
    ) {
        try {
            const result = await this.userUpdateHandler.updateAsync(
                id,
                req.body,
            );
            return this.json(result, StatusCodes.OK);
        } catch (error: any) {
            this.loggerService.error('UserController.updateUser error:', error);
            return this.json(error, error.status || StatusCodes.BAD_REQUEST);
        }
    }

    /**
     * @swagger
     * /users/{id}:
     *   get:
     *     summary: Get user info by ID
     *     tags: [Users]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: User found
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/UserDto'
     *       404:
     *         description: User not found
     */
    @httpGet('/:id')
    @withMiddleware(TYPES.AuthXApiKeyMiddleware)
    public async getUser(@requestParam('id') id: string) {
        try {
            const result = await this.userInfoHandler.getByIdAsync(id);
            return this.json(result, StatusCodes.OK);
        } catch (error: any) {
            this.loggerService.error('UserController.getUser error:', error);
            return this.json(error, error.status || StatusCodes.BAD_REQUEST);
        }
    }
    /**
     * @swagger
     * /users:
     *   get:
     *     tags:
     *       - Users
     *     summary: Get list of users
     *     description: Get a paginated list of users with optional filters.
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *           default: 1
     *         description: Page number
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *           default: 10
     *         description: Number of users per page
     *       - in: query
     *         name: userName
     *         schema:
     *           type: string
     *         description: Filter by userName (partial match)
     *       - in: query
     *         name: fullName
     *         schema:
     *           type: string
     *         description: Filter by fullName (partial match)
     *     responses:
     *       200:
     *         description: Successful response
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 total:
     *                   type: integer
     *                 page:
     *                   type: integer
     *                 limit:
     *                   type: integer
     *                 users:
     *                   type: array
     *                   items:
     *                     $ref: '#/components/schemas/User'
     */
    @httpGet('/')
    @withMiddleware(TYPES.AuthXAdminApiKeyMiddleware)
    public async getUsers(@queryParam() query: any) {
        try {
            const parsedQuery = GetUsersQuerySchema.parse(query);
            return this.userListHandler.execute(parsedQuery);
        } catch (error: any) {
            this.loggerService.error('UserController.getUsers error:', error);
            return this.json(error, error.status || StatusCodes.BAD_REQUEST);
        }
    }
}
