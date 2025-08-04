/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { NextFunction, Request, Response } from 'express';
import 'reflect-metadata';
import * as bodyParser from 'body-parser';
import { Container, inject } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { ConfigEnv } from './config/config.env';
import { InversifyContainer } from './bootstrap-contrainer';
import { TYPES } from './bootstrap-type';
import swaggerJSDoc from 'swagger-jsdoc';
import { ErrorHandlerMiddleware } from './shared/middlewares/error-handler.middleware';
import { LoggerMiddleware } from './shared/middlewares/logger.middleware';
import { MongooseProvider } from './shared/providers/mongoose.provider';
import { LoggerService } from './shared/services/logger.service';
import { responseInterceptor } from './shared/interceptors/response.interceptor';
import { RedisService } from './shared/services/redis.service';

export class BootstrapApp {
    private app: express.Application = {} as express.Application;
    private configEnv: ConfigEnv = {} as ConfigEnv;
    @inject(TYPES.LoggerService)
    private logger!: LoggerService;

    private container: Container = {} as Container;

    private swaggerDocs: any;

    constructor() {
        this.configEnv = new ConfigEnv();
        const IContainer = new InversifyContainer();
        this.container = IContainer.getContainer();
        this.logger = new LoggerService(this.configEnv);
    }

    public getAppContainer() {
        return this.container;
    }

    private async initProviders(): Promise<void> {
        try {
            const mongoProvider = this.container.get<MongooseProvider>(
                TYPES.MongooseProvider,
            );
            await mongoProvider.connect();
        } catch (error: any) {
            this.logger.error(`Mongo connection error: ${error}`);
            process.exit(1);
        }
    }

    private async initDependencies(): Promise<void> {
        const redis = this.container.get<RedisService>(TYPES.RedisService);
        redis.reader
            .on('connect', () => {
                this.logger.info('Redis client connected successfully.');
            })
            .on('error', (error: any) => {
                this.logger.error(`Redis connection error : ${error}`);
                process.exit(1);
            });
    }

    public getSwaggerDocs() {
        const swaggerOptions = {
            definition: {
                openapi: '3.0.0',
                info: {
                    title: 'Problem5 docs',
                    version: '1.0.0',
                    description: 'Auto-generated API docs',
                },
                servers: [
                    {
                        url: 'http://localhost:3001',
                        description: 'Local dev server',
                    },
                ],
                components: {
                    securitySchemes: {
                        ApiKeyAuth: {
                            type: 'apiKey',
                            in: 'header',
                            name: 'x-api-key',
                        },
                        BearerAuth: {
                            type: 'http',
                            scheme: 'bearer',
                            bearerFormat: 'JWT',
                        },
                        XAdminApiKey: {
                            type: 'apiKey',
                            in: 'header',
                            name: 'x-admin-api-key',
                        },
                    },
                },
            },
            security: [
                { BearerAuth: [] },
                { XAdminApiKey: [] },
                { ApiKeyAuth: [] },
            ],
            apis: [
                process.env.NODE_ENV === 'production'
                    ? 'dist/**/*.js'
                    : 'src/**/*.ts',
            ],
        };

        return swaggerJSDoc(swaggerOptions);
    }

    public async setup(): Promise<BootstrapApp> {
        await this.initProviders();
        await this.initDependencies();

        this.swaggerDocs = this.getSwaggerDocs();

        const server = new InversifyExpressServer(this.container);
        server.setConfig((app: express.Application) => {
            const loggerMiddleware = this.container.get<LoggerMiddleware>(
                TYPES.LoggerMiddleware,
            );

            app.use(
                bodyParser.urlencoded({
                    extended: true,
                }),
            );
            app.use(bodyParser.json());
            app.use(cors(this.configEnv.corsConfig));
            app.use(express.json());
            app.use(express.urlencoded({ extended: true }));
            app.use(
                '/api-docs',
                swaggerUi.serve,
                swaggerUi.setup(this.swaggerDocs, {
                    explorer: true,
                    customSiteTitle: 'Problem5 swagger',
                }),
            );

            app.use((req, res, next) =>
                loggerMiddleware.handler(req, res, next),
            );
            app.use(responseInterceptor);
        });

        server.setErrorConfig((app) => {
            const errorHandlerMiddleware =
                this.container.get<ErrorHandlerMiddleware>(
                    TYPES.ErrorHandlerMiddleware,
                );
            app.use(
                (err: Error, req: Request, res: Response, next: NextFunction) =>
                    errorHandlerMiddleware.handle(err, req, res, next),
            );
        });

        this.app = server.build();

        return this;
    }

    public async init(): Promise<void> {
        const { port } = this.configEnv;
        this.app.listen(port, () => {
            this.logger.info(`Server is running by port: ${port}`);
        });
    }

    public getServer(): express.Application {
        return this.app;
    }
}
