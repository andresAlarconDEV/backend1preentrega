import { Router } from 'express';
import UsersManager from '../../dao/Dao/Users.manager.js';

const router = Router();

router.post('/sessions/login', async(req, res) => {
    const { body } = req;
    try {
        const user = await UsersManager.loginUser(body);
        req.session.user = user;
        // res.status(201).send({message: 'sesión iniciada correctamente'});
        res.redirect('/products');
    }
    catch (error) {
        // res.status(401).send({message: error.message});
        return res.render('login', {message: error, failed: true });
    }
})

router.post('/sessions/register', async (req, res) => {
    const { body } = req;
    try {
        // res.status(201).json(await UsersManager.addUser(body));
        await UsersManager.addUser(body);
        return res.render('login', {message: 'Usuario creado correctamente, use los datos registrados para ingresar', createOK: true });

    }
    catch (error) {
        // res.status(400).send(error.message);
        return res.render('register', {message: 'No fue posible crear el usuario: Valide sus datos o contacte con el administrador del sistema', failed: true });
    }
});

router.get('/sessions/profile', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({message: 'No esta autenticado'})
    }
    res.status(200).json(req.session.user);
});

router.get('/session/logout', (req, res) => {
    req.session.destroy((error) => {
      if (error) {
        return res.status(400).send(error.message);
      }
      res.status(200).json({message: 'Se cerro la sesión correctamente'});
    });
  })


export default router;