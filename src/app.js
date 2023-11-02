// const express = require('express');
import express from 'express';
// const path = require('path');
import path  from 'path';
// const handlebars = require('express-handlebars');
import handlebars from 'express-handlebars';
import { __dirname } from './utils2.js';
const pathtest = __dirname;

// const productRouter= require('./routers/products.router');
import productRouter from './routers/products.router.js';
// const cartRouter = require('./routers/carts.router');
import cartRouter from './routers/carts.router.js';
// const homeRouter = require('./routers/home.router');
import homeRouter from './routers/home.router.js';
// const realTimeProductsRouter = require('./routers/realTimeProducts.router');
import realTimeProductsRouter from './routers/realTimeProducts.router.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.engine('handlebars', handlebars.engine());
console.log(__dirname)
app.set('views', path.join(__dirname, 'views')); 
app.set('view engine', 'handlebars');


app.use('/api', productRouter, cartRouter);
app.use('/realtimeproducts', realTimeProductsRouter);
app.use('/', homeRouter);

app.use((error, req, res, next) => {
    const message = 'ocurrio un error desconocido: '+error.message;
    console.error(message);
    res.status(500).json({message}); 
})


// module.exports = app;
export default app;




