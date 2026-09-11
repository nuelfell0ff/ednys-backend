import { Router } from 'express';

import {
  createAttendanceController,
  createBulkAttendanceController,
  getAttendanceByClassController,
  getAttendanceController,
  getStudentAttendanceController,
  updateAttendanceController,
} from './attendance.controller';

import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role.middleware';
import { UserRole } from '../users/user.model';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  requireRole(UserRole.TEACHER),
  createAttendanceController
);

router.post(
  '/bulk',
  requireRole(UserRole.TEACHER),
  createBulkAttendanceController
);

router.get(
  '/class',
  getAttendanceByClassController
);

router.get(
  '/student/:studentId',
  getStudentAttendanceController
);

router.get(
  '/:id',
  getAttendanceController
);

router.patch(
  '/:id',
  requireRole(UserRole.TEACHER),
  updateAttendanceController
);

export default router;
