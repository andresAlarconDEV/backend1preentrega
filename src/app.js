import express from 'express';
import handlebars from 'express-handlebars';
import path from 'path';

import { __dirname } from './utils2.js';

import productRouter from './routers/products.router.js';
import cartRouter from './routers/carts.router.js';
import homeRouter from './routers/home.router.js';
import realTimeProductsRouter from './routers/realTimeProducts.router.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.engine('handlebars', handlebars.engine());
console.log(__dirname)
app.set('views', path.join(__dirname , 'views')); 
app.set('view engine', 'handlebars');


app.use('/', homeRouter);
app.use('/api', productRouter, cartRouter);
app.use('/realtimeproducts', realTimeProductsRouter);

app.use((error, req, res, next) => {
    const message = 'ocurrio un error desconocido: '+error.message;
    console.error(message);
    res.status(500).json({message}); 
})

export default app;




