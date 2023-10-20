
const express = require('express');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended:true}));

const productRouter= require('./routers/products.router');

app.use('/api', productRouter);

app.listen(8080,() => {
    console.log('Servidor HTTP escuchando el puerto 8080');
})





