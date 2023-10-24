
const express = require('express');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended:true}));

const productRouter= require('./routers/products.router');
const cartRouter = require('./routers/carts.router')

app.use('/api', productRouter, cartRouter);

app.listen(8080,() => {
    console.log('Servidor HTTP escuchando el puerto 8080');
})





