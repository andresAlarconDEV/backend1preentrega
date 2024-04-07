import { Router }  from 'express';
// import ProductsManager from '../../dao/Dao/Products.manager.js';
import ProductsController from '../../controllers/products.controller.js';
import UsersController from '../../controllers/users.controller.js';
import { authMiddleware, authRolesMiddleware } from '../../utils/utils2.js';

const router = Router();



router.use('/', authMiddleware("jwt"), async (req, res) => {
    const endpoint = 'products/';
    const { query } = (req);
    try {
        const admin = req.user.role === 'admin' ? true : false; 
        const data = await ProductsController.getAll(query, endpoint);
        const user = await UsersController.getById(req.user.id);
        let cart;
        if(user.carts.length > 0)
        {cart = user.carts[0].idCart};
        res.render('product', {title: 'listado de productos', ...data, user: req.user, cart: cart, admin: admin });
    }
    catch(err)
    {console.log(err)};
    // res.render('product', {title: 'listado de productos', ...data, user: req.user.toJSON() });
});

export default router;