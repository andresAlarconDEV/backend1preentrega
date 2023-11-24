import { Router } from 'express';

const router = Router();

router.use('/', async (req, res) => {
        res.render('chat', {title: 'Chat Ecommerce'});
});


export default router;