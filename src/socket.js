import { Server } from "socket.io";
import products from "./dao/Dao/productManager.js";
import MessagesManager from "./dao/Dao/Messages.manager.js";
import ProductsManager from './dao/Dao/products.Manager.js';
import MessageModel from './dao/models/message.model.js';


let io;
const listProducts = await products.get();


export const initSocket = (httpserver) => {

    io = new Server(httpserver);

    io.on('connection', (socketClient) => {
        console.log("nuevo cliente socket conectado: " + socketClient.id);


        socketClient.emit('products', listProducts);

        socketClient.on('newProduct', async (newProduct) => {
            await products.addProduct(newProduct)
            const listProducts = await products.get();
            io.emit('products', listProducts);
        });

        socketClient.on('deleteProduct', async(value) => {
            console.log(value);
            await products.deleteProduct(value);
            const listProducts = await products.get();
            io.emit('products', listProducts);
        })
    })
};

