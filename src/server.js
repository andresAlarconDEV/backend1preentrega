import http from "http";
import app from "./app.js";
import { init } from "./socket.js";
const server = http.createServer(app);

const PORT = 8081;



init(server);

server.listen(PORT,() => {
    console.log('Servidor HTTP escuchando el puerto '+ PORT);
});

