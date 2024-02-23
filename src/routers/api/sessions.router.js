import { Router } from 'express';
import UsersController from '../../controllers/users.controller.js';
import EmailService from '../../services/email.service.js';
import passport from 'passport';
import { generateToken, generateRecoveryToken, validateRecoveryToken, authMiddleware, authRolesMiddleware } from '../../utils/utils2.js';
import UserDTO from '../../dto/user.dto.js';
import config from '../../config/config.js';

const router = Router();

router.get('/sessions/get', async (req, res) => {
  res.status(200).json(await UsersController.getAll());
});

router.post('/sessions/login', async (req, res, next) => {
  try {
    const user = await UsersController.getLoginUser(req.body);
    const token = generateToken(user);
    res.cookie('token', token, {
      maxAge: 1000 * 900,
      httpOnly: true,
    })
      .status(200)
      // .json({ status: 'success' })
      .redirect('/products');
  } catch (error) {
    next(error)
  }
 
});




router.post('/sessions/register', async (req, res, next) => {
  try {
    const user = await UsersController.postUser(req);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});


router.get('/sessions/current', authMiddleware('jwt'), async (req, res) => {
    // if (!req.user) {
    //     return res.status(401).json({message: 'No esta autenticado'})
    // }
    const user = await UsersController.getById(req.user.id);
    const userDTO = new UserDTO(user);
    res.status(200).json(userDTO);
});

router.post('/session/logout', (req, res) => {
    req.destroy((error) => {
      if (error) {
        return res.status(400).send(error.message);
      }
      res.status(200).json({message: 'Se cerro la sesión correctamente'});
    });
  })

  router.get('/sessions/github', passport.authenticate('github', {
    scope: ['user: email']
  }));

  router.get('/sessions/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/products');
  });


  router.post('/sessions/recovery', async (req, res, next) => {
    const { email } = req.body;
    try {
      const user = await UsersController.getByEmail(email);
      const emailService = EmailService.getInstance();
      const token = generateRecoveryToken(email);
      const result = await emailService.sendEmail(
        email,
        'Recuperación de contraseña - BikeShop',
        `<!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Recuperar Contraseña</title>
        </head>
        <body style="font-family: Arial, sans-serif;">
            <h2>Recuperar Contraseña</h2>
            <p>Hola,</p>
            <p>Haz clic en el siguiente botón para restablecer tu contraseña:</p>
            <a href="http://localhost:${config.port}/changePassword?token=${token}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Restablecer Contraseña</a>
            <p>Si no solicitaste restablecer tu contraseña, puedes ignorar este mensaje.</p>
            <p>Saludos,<br>BikeShop</p>
        </body>
        </html>`);
      res.status(200).render('recovery', {title: 'Recuperar contraseña', success: 'se ha enviado un correo con el link de recuperación'});
      // res.status(200).redirect('recovery');
    } catch (error) {
      res.render('recovery', {title: 'Recuperar contraseña', error: error.message});
    }
  });


  router.post('/sessions/changePass', async (req, res) => {
    const { token } = req.query;
    const { body } = req;

    try{
      const payload = await validateRecoveryToken(token);
      const { email } = payload;
      const responseChange = await UsersController.postChangePass(email, body);
            res.status(200).redirect('/confirmPass');
    }catch(error){
      if (error.code === 8){
        res.redirect('/recovery');
      }else{
      res.render('changePass', {title: 'Recuperar contraseña', error: error.message});
    }}

  });

  router.put('/users/premium/:uid',authMiddleware("jwt"), authRolesMiddleware(['admin']), async (req, res) => {
    const { uid } = req.params;
    try{
    const role = await UsersController.changeRole(uid);
    res.status(201).json({message: `Se realizo el cambio del rol por ${role}`});
    }catch(error){
      res.status(404).send(error.message);
    }
  })


export default router;