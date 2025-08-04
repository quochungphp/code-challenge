/* eslint-disable @typescript-eslint/no-explicit-any */
import { Container } from 'inversify';
import swaggerJSDoc from 'swagger-jsdoc';
import { ConfigEnv } from './config/config.env';
import { TYPES } from './bootstrap-type';
import { AppController } from './modules/app/app.controller';
import { LoggerService } from './shared/services/logger.service';
import { MongooseProvider } from './shared/providers/mongoose.provider';
import { UserRepository } from './modules/users/repositories/user.repository';
import { AuthXApiKeyMiddleware } from './shared/middlewares/auth-api-key.middleware';
import { ErrorHandlerMiddleware } from './shared/middlewares/error-handler.middleware';
import { LoggerMiddleware } from './shared/middlewares/logger.middleware';
import { RedisService } from './shared/services/redis.service';
import { UserController } from './modules/users/user.controller';
import { UserInfoRepository } from './modules/users/repositories/user-info.reposiory';
import { UserRegisterHandler } from './modules/users/handlers/user-register.handler';
import { UserDeleteHandler } from './modules/users/handlers/user-delete.handler';
import { UserUpdateHandler } from './modules/users/handlers/user-update.handler';
import { UserInfoHandler } from './modules/users/handlers/user-info.handler';
import { AuthXAdminApiKeyMiddleware } from './shared/middlewares/auth-admin-api-key.middleware';
import { UserListHandler } from './modules/users/handlers/user-list.handler';

type Dependency<T> = {
    type: symbol;
    class: new (...args: any[]) => T; // Generic class constructor
    singleton: boolean;
};
abstract class BaseInversifyContainer {
    protected configEnv: ConfigEnv;
    protected container: Container;

    constructor() {
        this.container = new Container();
        this.configEnv = new ConfigEnv();
    }
    public registerContainer(dependencies: Dependency<any>[]) {
        for (const de of dependencies) {
            const t = de.type;
            const c = de.class as any;
            if (de.singleton) {
                this.container.bind<typeof c>(t).to(c).inSingletonScope();
                continue;
            }

            this.container.bind<typeof c>(t).to(c);
        }
    }
}
class InversifyContainer extends BaseInversifyContainer {
    private static instance: InversifyContainer;
    private swaggerDocs: any;
    constructor() {
        super();
        this.swaggerDocs = this.setupSwagger();
        this.registerDependencies();
    }

    /** Singleton instance getter */
    public static getInstance(): InversifyContainer {
        if (!this.instance) {
            this.instance = new InversifyContainer();
        }
        return this.instance;
    }

    /** Get the Inversify container */
    public getContainer(): Container {
        return this.container;
    }

    /** Get Swagger Docs */
    public getSwaggerDocs(): any {
        return this.swaggerDocs;
    }

    /** Setup Swagger Docs */
    private setupSwagger() {
        const swaggerOptions = {
            definition: {
                openapi: '3.0.0',
                info: {
                    title: 'API Documentation - AI Service',
                    version: '1.0.0',
                },
            },
            apis: ['./dist/controllers/*.js'],
        };
        return swaggerJSDoc(swaggerOptions);
    }

    /** Init dependencies */
    private initDependencies(): Dependency<any>[] {
        const dependencies: Dependency<any>[] = [
            {
                type: TYPES.AppController,
                class: AppController,
                singleton: false,
            },
            {
                type: TYPES.UserController,
                class: UserController,
                singleton: false,
            },
            {
                type: TYPES.UserRegisterHandler,
                class: UserRegisterHandler,
                singleton: false,
            },
            {
                type: TYPES.UserDeleteHandler,
                class: UserDeleteHandler,
                singleton: false,
            },
            {
                type: TYPES.UserUpdateHandler,
                class: UserUpdateHandler,
                singleton: false,
            },
            {
                type: TYPES.UserListHandler,
                class: UserListHandler,
                singleton: false,
            },

            {
                type: TYPES.UserInfoHandler,
                class: UserInfoHandler,
                singleton: false,
            },
            {
                type: TYPES.ConfigEnv,
                class: ConfigEnv,
                singleton: false,
            },
            {
                type: TYPES.LoggerService,
                class: LoggerService,
                singleton: false,
            },
            {
                type: TYPES.MongooseProvider,
                class: MongooseProvider,
                singleton: false,
            },
            {
                type: TYPES.LoggerMiddleware,
                class: LoggerMiddleware,
                singleton: false,
            },
            {
                type: TYPES.RedisService,
                class: RedisService,
                singleton: false,
            },
            {
                type: TYPES.AuthXApiKeyMiddleware,
                class: AuthXApiKeyMiddleware,
                singleton: false,
            },
            {
                type: TYPES.AuthXAdminApiKeyMiddleware,
                class: AuthXAdminApiKeyMiddleware,
                singleton: false,
            },
            {
                type: TYPES.ErrorHandlerMiddleware,
                class: ErrorHandlerMiddleware,
                singleton: false,
            },
            {
                type: TYPES.UserRepository,
                class: UserRepository,
                singleton: false,
            },
            {
                type: TYPES.UserInfoRepository,
                class: UserInfoRepository,
                singleton: false,
            },
        ];
        return dependencies;
    }
    registerDependencies() {
        const DIs = [...this.initDependencies()];
        this.registerContainer(DIs);
    }
}

export { BaseInversifyContainer, InversifyContainer, Dependency };
