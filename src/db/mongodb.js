import mongoose from 'mongoose';
import config from '../config/config.js';

export const URI = config.mongodbUri;

export const init = async () => {
    try {
        await mongoose.connect(URI);
        console.log('Database connected susscessfully 🚀');
    } catch (error) {
        console.error('Ocurrio un error al intentar conectarnos a la base de datos 😨');
    }
}