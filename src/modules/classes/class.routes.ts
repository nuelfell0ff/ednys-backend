import { Router } from 'express';

import {
  createClassController,
  deleteClassController,
  getClassController,
  getClassesController,
  updateClassController,
} from './class.controller';

import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role.middleware';
import { UserRole } from '../users/user.model';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  requireRole(UserRole.ADMIN),
  createClassController
);

router.get(
  '/',
  getClassesController
);

router.get(
  '/:id',
  getClassController
);

router.patch(
  '/:id',
  requireRole(UserRole.ADMIN),
  updateClassController
);

router.delete(
  '/:id',
  requireRole(UserRole.ADMIN),
  deleteClassController
);

export default router;