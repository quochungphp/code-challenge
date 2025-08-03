import winston from 'winston';
import { ConfigEnv } from '../../config/config.env';
const { format, transports, createLogger } = winston;
const cgf = new ConfigEnv();

const logFormat = format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
);

const winstonLogger = createLogger({
    level: cgf.env === 'production' ? 'info' : 'debug',
    format: logFormat,
    transports: [
        new transports.Console({
            format: format.combine(format.colorize(), format.simple()),
        }),
    ],
});

export { winstonLogger };
