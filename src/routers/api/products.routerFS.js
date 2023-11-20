import { Router } from 'express';
// import ProductManager from "../dao/productManager.js";
import products from '../../dao/Dao/productManager.js';


const router = Router();

router.get('/products', async (req, res) => {
    const { query } = (req);
    const { limit } = query;
    if (limit) {
        const arrayProduct = await products.get();
        res.status(200).json(arrayProduct.slice(0, (limit)));
    } else {
        res.status(200).json(await products.get());
    }
});


router.get('/products/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        res.status(200).json(await products.getProductById(pid))
    }
    catch (error) {
        res.status(404).send(error.message);
    }
});

router.post('/products', async (req, res) => {
    const { body } = req;
    const img = req.file.path;
    try {
        res.status(201).json(await products.addProduct(body, img));
    }
    catch (error) {
        res.status(400).send(error.message);
    }
});

router.put('/products/:pid', async (req, res) => {
    const { pid } = req.params;
    const { body } = req;
    try {
        res.status(201).json(await products.updateProduct(pid, body));
    }
    catch (error) {
        res.status(400).send(error.message);
    }
});

router.delete('/products/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        res.status(201).json(await products.deleteProduct(pid));
    }
    catch (error) {
        res.status(404).send(error.message);
    }
});



export default router;

