import { Server } from "socket.io";
import products from "./dao/Dao/productManager.js";
import MessagesManager from "./dao/Dao/Messages.manager.js";



let io;
const listProducts = await products.get();
const initialConversation = 
    [
        {
          user: 'BIKESHOP',
          message: 'Bienvenido a nuestro chat de ecommerce social.',
        },
      ];



export const initSocket = (httpserver) => {

        io = new Server(httpserver);

        io.on('connection', (socketClient) => {
            console.log("nuevo cliente socket conectado: " + socketClient.id);


        socketClient.emit('products', listProducts);
        socketClient.emit('update-conversation', initialConversation);


        socketClient.on('newProduct', async (newProduct) => {
            await products.addProduct(newProduct)
            const listProducts = await products.get();
            io.emit('products', listProducts);
        });

        socketClient.on('deleteProduct', async(value) => {
            await products.deleteProduct(value);
            const listProducts = await products.get();
            io.emit('products', listProducts);
        });

        socketClient.on('new-message', async (newMessage)=> {
            await MessagesManager.addMessage(newMessage);
            const listMessages = await MessagesManager.get();
            io.emit('update-conversation', listMessages);
        });
    })
};

