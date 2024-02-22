import http from "http";
import config from "./config/config.js"
import app from "./app.js";
import { initSocket } from "./socket.js";
const server = http.createServer(app);
import MongoDb from './db/mongodb.js';
import { logger } from './config/logger.js';

const mongodb = await MongoDb.getInstance();

const PORT = config.port;

initSocket(server);

server.listen(PORT,() => {
    logger.info('Servidor HTTP escuchando el puerto '+ PORT);
});

