import { Router } from 'express';
import UsersController from '../../controllers/users.controller.js';
import { authMiddleware, authRolesMiddleware } from '../../utils/utils2.js';

const router = Router();


router.get('/users', authMiddleware("jwt"), authRolesMiddleware(['admin', 'user', 'premium']), async (req, res) => {
    res.status(200).json(await UsersController.getAll());
});


router.put('/users/premium/:uid', authMiddleware("jwt"), authRolesMiddleware(['admin']), async (req, res) => {
    const { uid } = req.params;
    try {
        const role = await UsersController.changeRole(uid);
        res.status(201).json({ message: `Se realizo el cambio del rol por ${role}` });
    } catch (error) {
        res.status(404).send(error.message);
    }
});

router.delete('/users', authMiddleware("jwt"), authRolesMiddleware(['admin']), async (req, res) => {
    res.status(200).json(await UsersController.deleteUserInactivity());
})

export default router;