import { Router }  from 'express';

const router = Router();

router.use('/', async (req, res) => {

    res.render('realTimeProducts', {title: 'RealTime Products'});
});


export default router;