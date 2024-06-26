import { Router } from 'express';
import CartsController from '../../controllers/carts.controller.js';
import { authMiddleware, authRolesMiddleware } from '../../utils/utils2.js';

const router = Router();

router.get('/carts', authMiddleware("jwt"), async (req, res) => {
    try {
        res.status(200).json(await CartsController.getAll());
    }
    catch (error) {
        res.status(404).send(error.message);
    }
});

router.post('/carts', authMiddleware("jwt"), authRolesMiddleware(['user','premium']), async (req, res) => {
    try {
        res.status(201).json(await CartsController.addCart(req));
    }
    catch (error) {
        res.status(400).send(error.message);
    }
});

router.get('/carts/:cid', authMiddleware("jwt"), async (req, res) => {
    const { cid } = req.params;
    try {
        res.status(200).json(await CartsController.getCartById(cid))
    }
    catch (error) {
        res.status(404).send(error.message);
    }
});


router.put('/carts/:cid',  authMiddleware("jwt"), authRolesMiddleware(['user']), async (req, res) => {
    const { cid } = req.params;
    const { body } = req;
    try {
        res.status(201).json(await CartsController.updateProductCart( cid, body ));
    }
    catch (error) {
        res.status(404).send(error.message);
    }
});


router.delete('/carts/:cid', authMiddleware("jwt"), authRolesMiddleware(['user']), async (req, res)=> {
    const { cid } = req.params;
    try {
        res.status(201).json(await CartsController.deleteAllProductCart( cid ));
    }
    catch (error) {
        res.status(404).send(error.message);
    }
});

router.post('/carts/:cid/product/:pid',  authMiddleware("jwt"), authRolesMiddleware(['user','premium']), async (req, res) => {
    const { cid, pid } = req.params;
    try {
        res.status(201).json(await CartsController.addProductInCart(cid, pid, req));
    }
    catch (error) {
        res.status(404).send(error.message);
    }
});

router.delete('/carts/:cid/product/:pid', authMiddleware("jwt"), async (req, res) => {
    const { cid, pid } = req.params;
    try {
        res.status(201).json(await CartsController.deleteProductInCart(cid, pid));
    }
    catch (error) {
        res.status(404).send(error.message);
    }
});

router.put('/carts/:cid/product/:pid', authMiddleware("jwt"), authRolesMiddleware(['user']), async (req, res) => {
    const { cid, pid } = req.params;
    const { body } = req;
    try {
        res.status(201).json(await CartsController.updateQuantityProductInCart( cid, pid, body ));
    }
    catch (error) {
        res.status(404).send(error.message);
    }
});

router.post('/carts/:cid/purchase', authMiddleware("jwt"), authRolesMiddleware(['user']), async (req, res) => {
    try {
        res.status(200).json(await CartsController.postPurchase(req))
    }
    catch (error) {
        res.status(404).send(error.message);
    }
});


export default router;