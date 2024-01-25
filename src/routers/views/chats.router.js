import { Router } from 'express';
import { authMiddleware, authRolesMiddleware } from '../../utils2.js';

const router = Router();

router.use('/', authMiddleware("jwt"), authRolesMiddleware('user'), async (req, res) => {
        res.render('chat', {title: 'Chat Ecommerce'});
});


export default router;