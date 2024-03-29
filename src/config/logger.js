import winston from 'winston';
import config from './config.js';

const customeLevelOpts = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    colors: {
        fatal: 'red',
        error: 'magenta',
        warning: 'yellow',
        info: 'blue',
        debug: 'white',
    },
};

export const prodLogger = winston.createLogger({
    levels: customeLevelOpts.levels,
    transports: [
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize({ colors: customeLevelOpts.colors }),
                winston.format.simple(),
            ),
        }),
        new winston.transports.File({
            filename: './errors.log',
            level: 'error',
            format: winston.format.simple(),
        }),
    ],
});

export const devLogger = winston.createLogger({
    levels: customeLevelOpts.levels,
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({ colors: customeLevelOpts.colors }),
                winston.format.simple(),
            ),
        })
    ],
});

export const logger = config.env === 'PRD' ? prodLogger : devLogger;

export const addLogger = (req, res, next) => {
    req.logger = logger;
    next();
};