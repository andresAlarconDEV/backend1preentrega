import express from 'express';
import compression from 'express-compression';
import handlebars from 'express-handlebars';
import path from 'path';
import cookieParser from 'cookie-parser';
// import sessions from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import cors from 'cors';
import config from "./config/config.js"

import { __dirname } from './utils2.js';
import { URI } from './db/mongodb.js';
import { init as initPassport } from './config/passport.config.js';
import { errorHandlerMiddleware } from './middlewares/error-handler.middleware.js';

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

const app = express();
// const SESSION_SECRET = config.sessionSecret;

const corsOptions = {
    origin: 'http://localhost:5500',
    methods: ['GET','POST','PUT','DELETE']
}

app.use(cookieParser());
// app.use(sessions({
//     store: MongoStore.create({
//         mongoUrl: URI,
//         mongoOptions: {},
//         ttl: 200,

//     }),
//     secret: SESSION_SECRET,
//     resave: true,
//     saveUninitialized: true
// }))


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


app.use('/api', productRouter, cartRouter, sessionsRouter);
app.use('/carts', cartsRouter);
app.use('/chat', messageRouter);
app.use('/products', productsRouter);
app.use('/realtimeproducts', realTimeProductsRouter);
app.use('/home', homeRouter);
app.use('/notification', notificationRouter);
app.use('/mocking', mockingRouter);
app.use('/', indexRouter); 
app.use('/*', notFoundRouter);


app.use((error, req, res, next) => {
    const message = 'ocurrio un error desconocido: ' + error.message;
    console.error(message);
    res.status(500).json({ message });
})

app.use(errorHandlerMiddleware);

export default app;




