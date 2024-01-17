import { Router }  from 'express';
import CartsManager from '../../dao/Dao/Carts.manager.js';
import CartsController from '../../controllers/carts.controller.js'
import { buildResponseProductsInCart } from '../../utils2.js';

const router = Router();

router.use('/:cid', async (req, res) => {
    const endpoint = 'carts/:cid';
    const { cid } = req.params;
    const data = await CartsController.getCartById(cid);
    const dataProduct = buildResponseProductsInCart(data);
    res.render('cart', {title: 'listado de productos del carrito: ', ...dataProduct});
});


export default router;