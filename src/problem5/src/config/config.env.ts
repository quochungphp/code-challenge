import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
dotenvExpand.expand(dotenv.config());
import { injectable } from 'inversify';
import { CorsOptions } from 'cors';


export enum ENVIRONMENT {
    STAGING = 'staging',
    PREPROD = 'preprod',
    PRODUCTION = 'production',
    LOCAL = 'local',
    TEST = 'test',
}

@injectable()
export class ConfigEnv {
    private int(value: string | undefined, fallback: number): number {
        return value && !isNaN(parseInt(value)) ? parseInt(value) : fallback;
    }

    private bool(value: string | undefined, fallback: boolean): boolean {
        if (value === undefined) return fallback;
        return value === 'true';
    }

    private cors(value: string | undefined): string[] | 'all' {
        if (!value || value === 'all') return 'all';
        return value.split(',').map((v) => v.trim());
    }

    get env(): string {
        return process.env.NODE_ENV || ENVIRONMENT.LOCAL;
    }

    get timeoutResponse(): number {
        return this.int(process.env.TIMEOUT_RESPONSE, 90000);
    }

    get port(): number {
        return this.int(process.env.PORT, 3001);
    }

    get wsPort(): number {
        return this.int(process.env.WS_PORT, 9011);
    }

    get isEnableTLSMongoConnect(): boolean {
        return [ENVIRONMENT.PREPROD, ENVIRONMENT.PRODUCTION].includes(
            this.env as ENVIRONMENT,
        );
    }

    get mongoDbUri(): string {
        if (this.bool(process.env.IS_INTEGRATION_TEST, false)) {
            return 'mongodb://mongo:27017/ai';
        }
        return process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai';
    }

    get jwtSecret(): string {
        return process.env.JWT_SECRET || 'Vjvhyuf77ugjugv7443Rf';
    }

    get jwtTokenExpire(): string {
        return process.env.JWT_TOKEN_EXPIRE || '7d';
    }
    get passwordSecret(): string {
        return process.env.PASSWORD_SECRET || 'Vjvhyuf77ugjugv7443Rf';
    }
    get saltRounds(): number {
        return this.int(process.env.SALT_ROUNDS, 10);
    }
    get xApiKey(): string {
        return process.env.X_API_KEY || 'xxxx-xxxx-xxxx-xxxx';
    }

    get corsConfig(): CorsOptions {
        return {
            origin: this.cors(process.env.CORS_ORIGINS),
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true,
        };
    }

    get isIntegrationTest(): boolean {
        return this.bool(process.env.IS_INTEGRATION_TEST, false);
    }

    get redisHost(): string {
        return process.env.IS_LOCAL_MACHINE === 'true'
            ? 'localhost'
            : process.env.REDIS_HOST || '127.0.0.1';
    }

    get redisReplicaHost(): string {
        return process.env.IS_LOCAL_MACHINE === 'true'
            ? 'localhost'
            : process.env.REDIS_REPLICA_HOST || '127.0.0.1';
    }

    get redisPort(): number {
        return this.int(process.env.REDIS_PORT, 6379);
    }

    get redisPassword(): string {
        return process.env.REDIS_PASSWORD || 'localhost';
    }

    get isEnableRedisTLS(): boolean {
        return this.env !== ENVIRONMENT.TEST && this.env !== ENVIRONMENT.LOCAL;
    }
}
