import { Router } from 'express';
import UsersController from '../../controllers/users.controller.js';
import passport from 'passport';
import { generateToken, validateToken, authMiddleware, authRolesMiddleware } from '../../utils2.js';
import UserDTO from '../../dto/user.dto.js';

const router = Router();

router.get('/sessions/get', async (req, res) => {
  res.status(200).json(await UsersController.getAll());
});

router.post('/sessions/login', async (req, res, next) => {
  try {
    const user = await UsersController.getLoginUser(req.body);
    const token = generateToken(user);
    res.cookie('token', token, {
      maxAge: 1000 * 60,
      httpOnly: true,
    })
      .status(200)
      .json({ status: 'success' })
      // .redirect('/products');
  } catch (error) {
    next(error)
  }
 
});


// router.post('/sessions/login', async(req, res) => {
//     // const { body } = req;
//     // try {
//         // const user = await UsersManager.loginUser(body);
//         // req.session.user = user;
//         // res.status(201).send({message: 'sesión iniciada correctamente'});
//         res.redirect('/products');
//     // }
//     // catch (error) {
//     //     // res.status(401).send({message: error.message});
//     //     return res.render('login', {message: error, failed: true });
//     // }
// })



router.post('/sessions/register', async (req, res, next) => {
  try {
    const user = await UsersController.postUser(req);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

// router.post('/sessions/register', passport.authenticate('register', { failureRedirect: '/register' }), async (req, res) => {
//     // const { body } = req;
//     // try {
//         // res.status(201).json(await UsersManager.addUser(body));
//         // await UsersManager.addUser(body);
//         // return res.render('login', {message: 'Usuario creado correctamente, use los datos registrados para ingresar', createOK: true });
//         // res.render('login', {message: 'Usuario creado correctamente, use los datos registrados para ingresar', createOK: true });
//         res.redirect('/login');
//     // } 
//     // catch (error) {
//         // res.status(400).send(error.message);
//         // return res.render('register', {message: 'No fue posible crear el usuario: Valide sus datos o contacte con el administrador del sistema', failed: true });
//     // }
// });

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


export default router;