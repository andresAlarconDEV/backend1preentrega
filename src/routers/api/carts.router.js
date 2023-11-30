import { Router } from 'express';
import CartsManager from '../../dao/Dao/carts.manager.js';

const router = Router();

router.get('/carts', async (req, res) => {
        res.status(200).json(await CartsManager.get());
});

router.get('/carts/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        res.status(200).json(await CartsManager.getCartById(cid))
    }
    catch (error) {
        res.status(404).send(error.message);
    }
});

router.post('/carts', async (req, res) => {
    try {
        res.status(201).json(await CartsManager.addCart());
    }
    catch (error) {
        res.status(400).send(error.message);
    }
});

router.post('/carts/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        res.status(201).json(await CartsManager.addProductInCart(cid, pid));
    }
    catch (error) {
        res.status(404).send(error.message);
    }
});

router.delete('/carts/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        res.status(201).json(await CartsManager.deleteProductInCart(cid, pid));
    }
    catch (error) {
        res.status(404).send(error.message);
    }
});

router.put('/carts/:cid', async (req, res) => {
    const { cid } = req.params;
    const { body } = req;
    try {
        res.status(201).json(await CartsManager.putCart( cid, body ));
    }
    catch (error) {
        res.status(404).send(error.message);
    }
});

router.put('/carts/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { body } = req;
    try {
        res.status(201).json(await CartsManager.putProductInCart( cid, pid, body ));
    }
    catch (error) {
        res.status(404).send(error.message);
    }
});

router.delete('/carts/:cid', async (req, res)=> {
    const { cid } = req.params;
    try {
        res.status(201).json(await CartsManager.deleteInCart( cid ));
    }
    catch (error) {
        res.status(404).send(error.message);
    }
})


export default router;