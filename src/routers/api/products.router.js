import { Router } from 'express';
import ProductsManager from '../../dao/Dao/Products.manager.js';
const router = Router();

router.get('/products', async (req, res) => {
    const endpoint = 'products/api/'; 
    const { query } = (req);
        res.status(200).json(await ProductsManager.get(query, endpoint));

});


router.get('/products/:pid([a-zA-Z0-9]+)', async (req, res) => {
    const { pid } = req.params;
    try {
        res.status(200).json(await ProductsManager.getProductById(pid))
    }
    catch (error) {
        res.status(404).send("Not found product");
    }
});

router.post('/products', async (req, res) => {
    const { body } = req;
    // const img = req.file.path;
    try {
        res.status(201).json(await ProductsManager.addProduct(body));
    }
    catch (error) {
        res.status(400).send(error.message);
    }
});

router.put('/products/:pid', async (req, res) => {
    const { pid } = req.params;
    const { body } = req;
    try {
        res.status(201).json(await ProductsManager.updateProduct(pid, body));
    }
    catch (error) {
        res.status(400).send(error.message);
    }
});

router.delete('/products/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        res.status(201).json(await ProductsManager.deleteProduct(pid));
    }
    catch (error) {
        res.status(404).send(error.message);
    }
});



export default router;

