// const  init = require("./socket");
import { init } from "./socket.js";
// const http = require("http")
import http from "http";
// const app = require("./app");
import app from "./app.js";

const PORT = 8080


const server = http.createServer(app);

init(server);

server.listen(PORT,() => {
    console.log('Servidor HTTP escuchando el puerto '+ PORT);
})

