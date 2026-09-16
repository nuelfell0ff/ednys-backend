import { Router } from 'express';

import {
  createBulkResultController,
  createResultController,
  deleteResultController,
  getMyChildrenResultsController,
  getMyResultsController,
  getResultController,
  getResultsController,
  publishResultController,
  updateResultController,
} from './result.controller';

import { authenticate } from '../../middleware/auth.middleware';

import { requireRole } from '../../middleware/role.middleware';

import { UserRole } from '../users/user.model';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  requireRole(UserRole.TEACHER),
  createResultController
);

router.post(
  '/bulk',
  requireRole(UserRole.TEACHER),
  createBulkResultController
);

router.get(
  '/my/children',
  requireRole(UserRole.PARENT),
  getMyChildrenResultsController
);

router.get(
  '/',
  requireRole(UserRole.ADMIN, UserRole.TEACHER),
  getResultsController
);

router.get(
  '/my',
  requireRole(UserRole.TEACHER),
  getMyResultsController
);

router.get(
  '/:id',
  requireRole(UserRole.ADMIN, UserRole.TEACHER),
  getResultController
);

router.post(
  '/:id/publish',
  requireRole(UserRole.ADMIN),
  publishResultController
);

router.patch(
  '/:id',
  requireRole(UserRole.TEACHER),
  updateResultController
);

router.delete(
  '/:id',
  requireRole(UserRole.TEACHER),
  deleteResultController
);

export default router;