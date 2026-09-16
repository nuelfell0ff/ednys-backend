import { Router } from 'express';

import {
  createParentStudentController,
  deleteParentStudentController,
  getMyStudentsController,
  getParentStudentController,
  getParentStudentsController,
  updateParentStudentController,
} from './parentstudent.controller';

import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role.middleware';
import { UserRole } from '../users/user.model';

const router = Router();

router.use(authenticate);

/*
 * Parent-specific route
 *
 * The authenticated user's userId is used to
 * resolve their Parent profile.
 *
 * Parents cannot provide another parentId
 * through the URL.
 */
router.get(
  '/my/students',
  requireRole(UserRole.PARENT),
  getMyStudentsController
);

/*
 * Administrative relationship management
 */
router.post(
  '/',
  requireRole(UserRole.ADMIN),
  createParentStudentController
);

router.get(
  '/',
  requireRole(UserRole.ADMIN),
  getParentStudentsController
);

router.get(
  '/:id',
  requireRole(UserRole.ADMIN),
  getParentStudentController
);

router.patch(
  '/:id',
  requireRole(UserRole.ADMIN),
  updateParentStudentController
);

router.delete(
  '/:id',
  requireRole(UserRole.ADMIN),
  deleteParentStudentController
);

export default router;