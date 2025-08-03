/* eslint-disable @typescript-eslint/no-explicit-any */
import { createLogger, format, transports, Logger } from 'winston';
import { inject, injectable } from 'inversify';
import { ConfigEnv } from '../../config/config.env';
import { TYPES } from '../../boostrap-type';

@injectable()
export class LoggerService {
    private logger: Logger;
    service = 'Logger';
    constructor(
        @inject(TYPES.ConfigEnv) private configEnv: ConfigEnv,
    ) {
        this.logger = createLogger({
            level: this.configEnv.env === 'production' ? 'info' : 'debug',
            format: format.combine(
                format.timestamp(),
                format.printf(({ level, message, timestamp }) => {
                    return `${timestamp} ${level}: ${message}`;
                }),
            ),
            transports: [
                new transports.Console({
                    format: format.combine(format.colorize(), format.simple()),
                }),
            ],
        });
    }
    name(service = 'Logger') {
        this.service = service;
    }
    private log(level: 'info' | 'debug' | 'error' | 'warn', message: any) {
        if (typeof message === 'object') {
            this.logger.log(level, `[${this.service}]`, message);
            return;
        }
        this.logger.log(level, `[${this.service}] ${message}`);
    }

    info(message: any) {
        this.log('info', message);
    }

    debug(message: any) {
        this.log('debug', message);
    }

    error(message: any) {
        this.log('error', message);
    }

    warn(message: any) {
        this.log('warn', message);
    }
}
