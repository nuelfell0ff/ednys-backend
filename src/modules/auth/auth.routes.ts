import { Router } from 'express';

import {
  getMeController,
  loginController,
  registerController,
} from './auth.controller';

import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.post('/register', registerController);

router.post('/login', loginController);

router.get(
  '/me',
  authenticate,
  getMeController
);

export default router;