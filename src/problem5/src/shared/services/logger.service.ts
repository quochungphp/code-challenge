/* eslint-disable @typescript-eslint/no-explicit-any */
import { createLogger, format, transports, Logger } from 'winston';
import { inject, injectable } from 'inversify';
import { ConfigEnv } from '../../config/config.env';
import { TYPES } from '../../bootstrap-type';

@injectable()
export class LoggerService {
    private logger: Logger;
    private context: string;

    constructor(@inject(TYPES.ConfigEnv) private configEnv: ConfigEnv) {
        const isProduction = this.configEnv.env === 'production';

        this.logger = createLogger({
            level: isProduction ? 'info' : 'debug',
            format: format.combine(
                format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                format.errors({ stack: true }), // Log error stack traces
                format.splat(),
                format.printf(({ level, message, timestamp, ...meta }) => {
                    const context = meta.context ? `[${meta.context}]` : '';
                    const rest = Object.keys(meta).length
                        ? JSON.stringify(meta)
                        : '';
                    return `${timestamp} ${level} ${context}: ${message} ${rest}`;
                }),
            ),
            transports: [
                new transports.Console({
                    format: format.combine(format.colorize(), format.simple()),
                }),
            ],
        });

        this.context = 'Logger'; // Default context
    }

    setContext(context: string) {
        this.context = context;
    }

    private log(
        level: 'info' | 'debug' | 'error' | 'warn',
        message: any,
        meta?: Record<string, any>,
    ) {
        const baseMeta = { context: this.context };

        if (message instanceof Error) {
            this.logger.log(level, message.message, {
                ...baseMeta,
                stack: message.stack,
                ...meta,
            });
        } else if (typeof message === 'object') {
            this.logger.log(level, JSON.stringify(message), {
                ...baseMeta,
                ...meta,
            });
        } else {
            this.logger.log(level, message, { ...baseMeta, ...meta });
        }
    }

    info(message: any, meta?: Record<string, any>) {
        this.log('info', message, meta);
    }

    debug(message: any, meta?: Record<string, any>) {
        this.log('debug', message, meta);
    }

    warn(message: any, meta?: Record<string, any>) {
        this.log('warn', message, meta);
    }

    error(message: any, meta?: Record<string, any>) {
        this.log('error', message, meta);
    }
}
