import { Router }  from 'express';
// import ProductsManager from '../../dao/Dao/Products.manager.js';
import ProductsController from '../../controllers/products.controller.js'


const router = Router();

router.use('/', async (req, res) => {
    if (!req.user) {
        res.redirect('/login');
    } else {
    const endpoint = 'products/';
    console.log(req.user);
    const { query } = (req);
    const data = await ProductsController.getAll(query, endpoint);
    res.render('product', {title: 'listado de productos', ...data, user: req.user.toJSON() });
    }
});


export default router;