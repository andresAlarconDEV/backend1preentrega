import { Router }  from 'express';
import ProductsManager from '../../dao/Dao/Products.manager.js';

const router = Router();

router.use('/', async (req, res) => {
    if (!req.session.user) {
        res.redirect('/login');
    } else {
    const endpoint = 'products/';
    const { query } = (req);
    const data = await ProductsManager.get(query, endpoint);
    res.render('product', {title: 'listado de productos', ...data, user: req.session.user });
    }
});


export default router;