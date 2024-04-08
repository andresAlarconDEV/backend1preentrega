import { Router } from 'express';
import CartsController from '../../controllers/carts.controller.js'
import { buildResponseProductsInCart } from '../../utils/utils2.js';
import { authMiddleware, authRolesMiddleware } from '../../utils/utils2.js';

const router = Router();

router.use('/addProductInCart/:pid', authMiddleware("jwt"), async (req, res) => {
    const { cid, pid } = req.params;
    try {
        await CartsController.addProductInCart(cid, pid, req);
        res.redirect("/products");
    }
    catch (error) {
        res.redirect("/products");
    }
});

router.use('/:cid/purchase', authMiddleware("jwt"), async (req, res) => {
    try {
        const ticket = await CartsController.postPurchase(req);
        console.log("ticket", ticket);
        res.render('ticket', { title: 'Ticket de compra: ', ticket: ticket.ticketInfo.toJSON() });
    }
    catch (error) {
        console.log(error);
        res.status(404).send(error.message);
    }
});

router.use('/:cid', async (req, res) => {
    const endpoint = 'carts/:cid';
    const { cid } = req.params;
    try {
        const data = await CartsController.getCartById(cid);
        const dataProduct = buildResponseProductsInCart(data);
        res.render('cart', { title: 'listado de productos del carrito: ', ...dataProduct });
    } catch (err) {
        console.log(err);
        res.redirect("/");
    }
});



export default router;