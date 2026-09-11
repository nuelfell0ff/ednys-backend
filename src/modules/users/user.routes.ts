import { Router } from 'express';

import {
  createUserController,
  getUserController,
} from './user.controller';

import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role.middleware';
import { UserRole } from './user.model';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  requireRole(UserRole.ADMIN),
  createUserController
);

router.get(
  '/:id',
  getUserController
);

export default router;