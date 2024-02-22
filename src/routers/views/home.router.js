
import { Router }  from 'express';

import ProductsController from '../../controllers/products.controller.js'

const router = Router();


router.use('/', async (req, res) => {
    let listProducts = await ProductsController.getAll(req);
    console.log(listProducts);
    res.render('home', {title: 'De camino para PreEntrega2', products: listProducts});
});


// module.exports = router;
export default router;