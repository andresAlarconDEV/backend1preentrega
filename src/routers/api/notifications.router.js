import { Router } from 'express';
import EmailService from '../../services/email.service.js';
import path from 'path';
import { __dirname } from '../../utils2.js';

const router = Router();

router.get('/sendEmail', async(req, res) => {
const emailService = EmailService.getInstance();
const result = await emailService.sendEmail(
    'valarcon2712@gmail.com',
    'Prueba de envio de Mail',
    '<p>HOLA, PRUEBA</p><img src="cid:api.png" alt="api" />',
    [{
        filename: 'api.png',
        path: path.join(__dirname, './images/api.png'),
        cid: 'api.png'
    }]
);
res.status(200).json(result);
});


export default router;