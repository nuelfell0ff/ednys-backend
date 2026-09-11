import { Router } from 'express';

import {
  createTeacherAssignmentController,
  deleteTeacherAssignmentController,
  getTeacherAssignmentController,
  getTeacherAssignmentsController,
  updateTeacherAssignmentController,
} from './teacher-assignment.controller';

import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role.middleware';
import { UserRole } from '../users/user.model';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  requireRole(UserRole.ADMIN),
  createTeacherAssignmentController
);

router.get(
  '/',
  getTeacherAssignmentsController
);

router.get(
  '/:id',
  getTeacherAssignmentController
);

router.patch(
  '/:id',
  requireRole(UserRole.ADMIN),
  updateTeacherAssignmentController
);

router.delete(
  '/:id',
  requireRole(UserRole.ADMIN),
  deleteTeacherAssignmentController
);

export default router;