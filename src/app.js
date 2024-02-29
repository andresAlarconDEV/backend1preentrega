import express from 'express';
import compression from 'express-compression';
import handlebars from 'express-handlebars';
import path from 'path';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import cors from 'cors';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { __dirname } from './utils/utils2.js';
import { init as initPassport } from './config/passport.config.js';
import { errorHandlerMiddleware } from './middlewares/error-handler.middleware.js';
import { addLogger } from './config/logger.js';

import productRouter from './routers/api/products.router.js';
import cartRouter from './routers/api/carts.router.js';
import homeRouter from './routers/views/home.router.js';
import realTimeProductsRouter from './routers/views/realTimeProducts.router.js';
import messageRouter from './routers/views/chats.router.js';
import productsRouter from './routers/views/products.router.js';
import cartsRouter from './routers/views/carts.router.js';
import notFoundRouter from './routers/views/notFound.router.js';
import sessionsRouter from './routers/api/sessions.router.js';
import indexRouter from './routers/views/index.router.js';
import notificationRouter from './routers/api/notifications.router.js';
import mockingRouter from './routers/api/mocking.router.js';
import loggerRouter from './routers/api/logger.router.js';

const app = express();
// const SESSION_SECRET = config.sessionSecret;

const corsOptions = {
    origin: 'http://localhost:5500',
    methods: ['GET','POST','PUT','DELETE']
}

app.use(addLogger);
app.use(cookieParser());


app.use(compression({
    brotli:{enabled:true, zlib:{}}
}));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));


app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

initPassport();
app.use(passport.initialize());
// app.use(passport.session());
const test= path.join(__dirname, 'docs','**', '*.yaml');
console.log(test)
const swaggerOpts = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Ecommerce BikeShop',
            description: 'Documentación API de BikeShop Ecommerce.'
        },
    },
    apis: [path.join(__dirname, 'docs','**', '*.yaml')],
};
const specs = swaggerJsDoc(swaggerOpts);
app.use('/api-swagger', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api', productRouter, cartRouter, sessionsRouter);
app.use('/carts', cartsRouter);
app.use('/chat', messageRouter);
app.use('/products', productsRouter);
app.use('/realtimeproducts', realTimeProductsRouter);
app.use('/home', homeRouter);
app.use('/notification', notificationRouter);
app.use('/mocking', mockingRouter);
app.use('/loggerTest', loggerRouter);
app.use('/', indexRouter); 
app.use('/*', notFoundRouter);


app.use(errorHandlerMiddleware);

export default app;
    
    
        
        
        