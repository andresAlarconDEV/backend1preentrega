import { Router }  from 'express';
import { generateToken, generateRecoveryToken, validateRecoveryToken, authMiddleware, authRolesMiddleware } from '../../utils/utils2.js';
import UsersController from '../../controllers/users.controller.js';

const router = Router();



router.use('/changeRole/:uid', authMiddleware("jwt"), authRolesMiddleware(['admin']), async(req, res) => {
    const { uid } = req.params;
    try{
    const role = await UsersController.changeRole(uid);
    const users = await UsersController.getAll();
    res.render('user', {title: 'listado de Usuarios', users: users });
    }
    catch(error){
        const users = await UsersController.getAll();
        res.render('user', {title: 'listado de Usuarios', users: users });
    }
    // res.clearCookie('token').redirect('/login');
})

router.use('/deleteUser/:uid', authMiddleware("jwt"), authRolesMiddleware(['admin']), async(req, res) => {
    const { uid } = req.params;
    try{
    await UsersController.usersDelete(uid);
    const users = await UsersController.getAll();
    res.render('user', {title: 'listado de Usuarios', users: users });
    }
    catch(error){
        const users = await UsersController.getAll();
        res.render('user', {title: 'listado de Usuarios', users: users });
    }
    // res.clearCookie('token').redirect('/login');
})

router.use('/', authMiddleware("jwt"), authRolesMiddleware(['admin']), async(req, res) => {
    const users = await UsersController.getAll();
    res.render('user', {title: 'listado de Usuarios', users: users });
    // res.clearCookie('token').redirect('/login');
    })


export default router;