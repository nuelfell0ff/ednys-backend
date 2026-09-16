import { Router } from 'express';

import {
  createStudentController,
  deleteStudentController,
  getMyChildrenStudentsController,
  getStudentController,
  getStudentsController,
  updateStudentController,
} from './student.controller';

import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role.middleware';
import { UserRole } from '../users/user.model';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  requireRole(UserRole.ADMIN),
  createStudentController
);

router.get(
  '/my/children',
  requireRole(UserRole.PARENT),
  getMyChildrenStudentsController
);

router.get(
  '/',
  requireRole(UserRole.ADMIN, UserRole.TEACHER),
  getStudentsController
);

router.get(
  '/:id',
  requireRole(UserRole.ADMIN, UserRole.TEACHER),
  getStudentController
);

router.patch(
  '/:id',
  requireRole(UserRole.ADMIN),
  updateStudentController
);

router.delete(
  '/:id',
  requireRole(UserRole.ADMIN),
  deleteStudentController
);

export default router;