import mongoose from 'mongoose';
import messageModel from '../dao/models/message.model.js';

const URI = 'mongodb+srv://developer:wtBxuyWSvYBsThkW@cluster0.zs9frjx.mongodb.net/ecommerce';

export const init = async () => {
    try {
        await mongoose.connect(URI);
        console.log('Database connected susscessfully 🚀');
    } catch (error) {
        console.error('Ocurrio un error al intentar conectarnos a la base de datos 😨');
    }
}