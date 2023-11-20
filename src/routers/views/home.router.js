
import { Router }  from 'express';

import products from "../../dao/Dao/productManager.js";

const router = Router();


router.use('/', async (req, res) => {
    let listProducts = await products.get();
    res.render('home', {title: 'De camino para PreEntrega2', products: listProducts});
});


// module.exports = router;
export default router;