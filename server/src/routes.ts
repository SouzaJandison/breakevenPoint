import { Router } from 'express';

import userController from './controllers/UserController';
import sessionController from './controllers/SessionController';
import pointController from './controllers/PointController';

const router = Router();

router.post('/', userController.create);
router.post('/session', sessionController.create);
router.get('/auth', userController.index);

router.post('/point', pointController.create);
router.get('/point/:id', pointController.show);
router.delete('/point/:id', pointController.delete);

export { router };