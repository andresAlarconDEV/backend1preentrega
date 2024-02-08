import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  req.logger.debug('Hola desde el request index home 😁 (debug)');
  req.logger.http('Hola desde el request index home 😁 (http)');
  req.logger.info('Hola desde el request index home 😁 (info)');
  req.logger.warning('Hola desde el request index home 😁 (warning)');
  req.logger.error('Hola desde el request index home 😁 (error)');
  req.logger.fatal('Hola desde el request index home 😁 (fatal)');
  res.send('Validador de funcionamiento de Logger');
});

export default router;