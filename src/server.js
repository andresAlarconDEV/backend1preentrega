import http from "http";
import app from "./app.js";
import { initSocket } from "./socket.js";
const server = http.createServer(app);
import { init } from './db/mongodb.js';


const PORT = 8080;

await init();

initSocket(server);

server.listen(PORT,() => {
    console.log('Servidor HTTP escuchando el puerto '+ PORT);
});

