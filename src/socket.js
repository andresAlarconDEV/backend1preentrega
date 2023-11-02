import { Server } from "socket.io";
import products from "../src/productManager.js";


let io;

const listProducts = await products.get();

export const init = (httpserver) => {

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

