import http from "http";
import config from "./config/config.js"
import app from "./app.js";
import { initSocket } from "./socket.js";
const server = http.createServer(app);
import { init } from './db/mongodb.js';


const PORT = config.port;

await init();

initSocket(server);

server.listen(PORT,() => {
    console.log('Servidor HTTP escuchando el puerto '+ PORT);
});

