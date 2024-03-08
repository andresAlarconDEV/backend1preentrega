import { Router } from 'express';
// import ProductsManager from '../../dao/Dao/Products.manager.js';
import ProductsController from '../../controllers/products.controller.js'
const router = Router();
import { authMiddleware, authRolesMiddleware } from '../../utils/utils2.js';

router.get('/products', authMiddleware("jwt"), async (req, res) => {
    const endpoint = 'products/api/'; 
    const { query } = (req);
    try {
        res.status(200).json(await ProductsController.getAll(query, endpoint));
    }
    catch (error) {
        res.status(404).send("Not found products");
    }
});

router.post('/products', authMiddleware("jwt"), authRolesMiddleware(['admin','premium']), async (req, res) => {
    const { body } = req;
    // const img = req.file.path;
    try {
        res.status(201).json(await ProductsController.addProduct(req, body));
    }
    catch (error) {
        res.status(400).send(error.message);
    }
});

router.get('/products/:pid([a-zA-Z0-9]+)', authMiddleware("jwt"), async (req, res) => {
    const { pid } = req.params;
    try {
        res.status(200).json(await ProductsController.getProductById(pid))
    }
    catch (error) {
        res.status(404).send("Not found product");
    }
});


router.put('/products/:pid', authMiddleware("jwt"), authRolesMiddleware(['admin','premium']), async (req, res) => {
    const { pid } = req.params;
    const { body } = req;
    try {
        res.status(202).json(await ProductsController.updateProduct(pid, body));
    }
    catch (error) {
        res.status(400).send(error.message);
    }
});

router.delete('/products/:pid', authMiddleware("jwt"), authRolesMiddleware(['admin', 'premium']), async (req, res) => {
    const { pid } = req.params;
    try {
        res.status(201).json(await ProductsController.deleteProduct(req, pid));
    }
    catch (error) {
        res.status(404).send(error.message);
    }
});



export default router;

