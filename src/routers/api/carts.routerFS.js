import { Router } from 'express';
import carts from "../../dao/Dao/cartManager.js";


const router = Router();



router.get('/carts/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        res.status(200).json(await carts.getCartById(cid))
    }
    catch (error) {
        res.status(404).send(error.message);
    }
});

router.post('/carts', async (req, res) => {
    try {
        res.status(201).json(await carts.addCart());
    }
    catch (error) {
        res.status(400).send(error.message);
    }
});

router.post('/carts/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        res.status(201).json(await carts.addProductInCart(cid, pid));
    }
    catch (error) {
        res.status(404).send(error.message);
    }
});



// module.exports = router;

export default router;