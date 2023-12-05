import { Router }  from 'express';

const router = Router();

router.use('/', async (req, res) => {
    res.render('notFound', {title: 'Pagina no encontrada '});
});


export default router;