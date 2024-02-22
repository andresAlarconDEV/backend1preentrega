import { Router }  from 'express';
// import ProductsManager from '../../dao/Dao/Products.manager.js';
import ProductsController from '../../controllers/products.controller.js'
import { authMiddleware, authRolesMiddleware } from '../../utils/utils2.js';

const router = Router();

router.use('/', authMiddleware("jwt"), async (req, res) => {
    const endpoint = 'products/';
    const { query } = (req);
    const data = await ProductsController.getAll(query, endpoint);
    res.render('product', {title: 'listado de productos', ...data, user: req.user });
    // res.render('product', {title: 'listado de productos', ...data, user: req.user.toJSON() });
});


export default router;