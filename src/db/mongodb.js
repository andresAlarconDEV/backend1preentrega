import mongoose from 'mongoose';
import config from '../config/config.js';
import { logger } from '../config/logger.js';

export default class MongoDb {
    static #instance = null;
    constructor(connection) {
        this.connection = connection;
    }
    static async getInstance() {
        if (!MongoDb.#instance) {
            try {
                const URI = config.mongodbUri;
                const connection = await mongoose.connect(URI);
                logger.info('Database connected susscessfully 🚀');
                MongoDb.#instance = new MongoDb(connection);
            } catch (error) {
                logger.fatal('Ocurrio un error al intentar conectarnos a la base de datos 😨');
            }
        }
        return MongoDb.#instance;
    }
}