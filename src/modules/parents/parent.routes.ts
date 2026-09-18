import { Router } from 'express';

import {
  createParentController,
  getMyParentDashboardController,
  getMyParentProfileController,
  getParentByUserController,
  getParentController,
  getParentsController,
  updateParentController,
} from './parent.controller';

import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role.middleware';
import { UserRole } from '../users/user.model';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  requireRole(UserRole.ADMIN),
  createParentController
);

router.get(
  '/my',
  requireRole(UserRole.PARENT),
  getMyParentProfileController
);

router.get(
  '/dashboard',
  requireRole(UserRole.PARENT),
  getMyParentDashboardController
);

router.get(
  '/',
  requireRole(UserRole.ADMIN),
  getParentsController
);

router.get(
  '/user/:userId',
  requireRole(UserRole.ADMIN),
  getParentByUserController
);

router.get(
  '/:id',
  requireRole(UserRole.ADMIN),
  getParentController
);

router.patch(
  '/:id',
  requireRole(UserRole.ADMIN),
  updateParentController
);

export default router;