import { Router }  from 'express';

const router = Router();



router.use('/login', async (req, res) => {
    res.render('login', {title: 'Login'});
});

router.use('/register', async (req, res) => {
    res.render('register', {title: 'Registro de usuario'});
});

router.use('/profile', async (req, res) => {
    if (!req.session.user) {
        // return res.status(401).json({message: 'No esta autenticado'})
        res.redirect('/login');
    }
    // console.log(req.session.user);
    res.render('profile', req.session.user);
    
});

router.get('/logout', (req, res) => {
    req.session.destroy((error) => {
      if (error) {
        // return res.render('login', { title: 'Hello People 🖐️', messageError: error.message });
        return res.render('login', {message: error, failed: true });
      }
      res.redirect('/login');
    });
  })

  router.use('/', async (req, res) => {
    res.render('login', {title: 'Login'});
  });

export default router;