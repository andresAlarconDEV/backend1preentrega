import { Router }  from 'express';
import ProductsManager from '../../dao/Dao/Products.manager.js';

const router = Router();

router.use('/', async (req, res) => {
    const endpoint = 'products/';
    const { query } = (req);
    const data = await ProductsManager.get(query, endpoint);
    console.log(data)
    res.render('product', {title: 'listado de productos', ...data});
});


export default router;