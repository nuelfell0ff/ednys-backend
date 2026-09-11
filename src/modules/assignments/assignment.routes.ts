import { Router } from 'express';

import {
  createAssignmentController,
  deleteAssignmentController,
  getAssignmentController,
  getAssignmentsController,
  getMyAssignmentsController,
  updateAssignmentController,
} from './assignment.controller';

import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role.middleware';
import { UserRole } from '../users/user.model';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  requireRole(UserRole.TEACHER),
  createAssignmentController
);

router.get(
  '/',
  getAssignmentsController
);

router.get(
  '/my',
  requireRole(UserRole.TEACHER),
  getMyAssignmentsController
);

router.get(
  '/:id',
  getAssignmentController
);

router.patch(
  '/:id',
  requireRole(UserRole.TEACHER),
  updateAssignmentController
);

router.delete(
  '/:id',
  requireRole(UserRole.TEACHER),
  deleteAssignmentController
);

export default router;