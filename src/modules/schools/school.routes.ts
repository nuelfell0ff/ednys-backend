import { Router } from 'express';

import {
  createSchoolController,
  getSchoolController,
  updateSchoolController,
} from './school.controller';

import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role.middleware';
import { UserRole } from '../users/user.model';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  requireRole(UserRole.SUPER_ADMIN),
  createSchoolController
);

router.get(
  '/:id',
  requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  getSchoolController
);

router.patch(
  '/:id',
  requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  updateSchoolController
);

export default router;