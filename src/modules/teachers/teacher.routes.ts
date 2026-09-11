import { Router } from 'express';

import {
  createTeacherController,
  deleteTeacherController,
  getTeacherController,
  getTeachersController,
  updateTeacherController,
} from './teacher.controller';

import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role.middleware';
import { UserRole } from '../users/user.model';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  requireRole(UserRole.ADMIN),
  createTeacherController
);

router.get(
  '/',
  getTeachersController
);

router.get(
  '/:id',
  getTeacherController
);

router.patch(
  '/:id',
  requireRole(UserRole.ADMIN),
  updateTeacherController
);

router.delete(
  '/:id',
  requireRole(UserRole.ADMIN),
  deleteTeacherController
);

export default router;