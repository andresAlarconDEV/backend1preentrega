import { Router } from 'express';
import { generateProduct } from '../../utils/utils2.js';
import config from '../../config/config.js';

const router = Router();

router.get('/mockingproducts', (req, res) => {
    const products = [];
    for (let index = 0; index < config.productFaker; index++) {
        products.push(generateProduct());
    }
    res.status(200).json(products);
  });
  
  export default router;