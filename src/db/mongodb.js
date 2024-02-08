import mongoose from 'mongoose';
import config from '../config/config.js';
import { logger } from '../config/logger.js';

export const URI = config.mongodbUri;

export const init = async () => {
    try {
        await mongoose.connect(URI);
        logger.info('Database connected susscessfully 🚀');
    } catch (error) {
        logger.fatal('Ocurrio un error al intentar conectarnos a la base de datos 😨');
    }
}