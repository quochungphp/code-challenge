import 'reflect-metadata';
import { ConfigEnv, ENVIRONMENT } from '../../config/config.env';
import { BootstrapApp } from '../../bootstrap-app';
import { TYPES } from '../../bootstrap-type';
import { UserRepository } from '../../modules/users/repositories/user.repository';
import { MongooseProvider } from '../providers/mongoose.provider';
import { RedisService } from '../services/redis.service';
import { winstonLogger } from './winston-logger';
import { waitTime } from './wait-time';
import { UserInfoRepository } from '../../modules/users/repositories/user-info.reposiory';

export type SetupContinuousIntegrationTest = {
    app: BootstrapApp;
    configEnv: ConfigEnv;
    redisService: RedisService;
    userRepository: UserRepository;
    userInfoRepository: UserInfoRepository;
    truncateTables: () => Promise<void>;
    disconnect: () => Promise<void>;
};

export async function setupContinuousIntegrationTest(): Promise<SetupContinuousIntegrationTest> {
    const app = new BootstrapApp();
    const container = app.getAppContainer();
    await app.setup();
    const userRepository = container.get<UserRepository>(TYPES.UserRepository);
    const userInfoRepository = container.get<UserInfoRepository>(
        TYPES.UserInfoRepository,
    );
    const mongoProvider = container.get<MongooseProvider>(
        TYPES.MongooseProvider,
    );
    const configEnv = container.get<ConfigEnv>(TYPES.ConfigEnv);
    const redisService = container.get<RedisService>(TYPES.RedisService);

    return {
        app,
        configEnv,
        redisService,
        userRepository,
        userInfoRepository,
        truncateTables: async () => {
            await truncateTables(configEnv, mongoProvider);
        },
        disconnect: async () => {
            await mongoProvider.disconnect();
            await redisService.writer.flushall();
            await redisService.reader.quit();
            await redisService.writer.quit();
            await waitTime(500);
        },
    };
}
export const truncateTables = async (
    configEnv: ConfigEnv,
    mongoProvider: MongooseProvider,
): Promise<void> => {
    try {
        if (configEnv.env !== ENVIRONMENT.PRODUCTION) {
            await mongoProvider.dropDB();
        }
    } catch (error) {
        winstonLogger.error(
            'Truncate tables has error in SetupContinuousIntegrationTest.truncateTables',
            error,
        );
    }
};
