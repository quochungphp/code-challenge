import mongoose, { ConnectOptions } from 'mongoose';
import { inject, injectable } from 'inversify';
import { ConfigEnv } from '../../config/config.env';
import { TYPES } from '../../bootstrap-type';
import { winstonLogger } from '../utils/winston-logger';

@injectable()
export class MongooseProvider {
    constructor(@inject(TYPES.ConfigEnv) private configEnv: ConfigEnv) {}

    public async connect(): Promise<void> {
        try {
            const { mongoDbUri } = this.configEnv;
            const connectOptions: ConnectOptions = {
                dbName: 'ai',
            };
            await mongoose.connect(mongoDbUri, connectOptions);
            winstonLogger.info('Connected to MongoDB');
        } catch (error) {
            winstonLogger.error('Error connecting to MongoDB:', error);
            process.exit(1);
        }
    }
    public async disconnect(): Promise<void> {
        try {
            await mongoose.connection.close();
            await mongoose.disconnect();
            winstonLogger.info('Disconnected from MongoDB');
        } catch (error) {
            winstonLogger.error('Error disconnecting from MongoDB:', error);
        }
    }

    public async dropDB(): Promise<void> {
        try {
            await mongoose.connection.dropDatabase();
            winstonLogger.info('Dropped data from MongoDB');
        } catch (error) {
            winstonLogger.error('Error drop data from MongoDB:', error);
        }
    }
}
