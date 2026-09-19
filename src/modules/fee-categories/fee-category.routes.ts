import { Router } from 'express';

import {
  createFeeCategoryController,
  deleteFeeCategoryController,
  getFeeCategoriesController,
  getFeeCategoryController,
  updateFeeCategoryController,
} from './fee-category.controller';

import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role.middleware';
import { UserRole } from '../users/user.model';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  requireRole(UserRole.ADMIN),
  createFeeCategoryController
);

router.get(
  '/',
  requireRole(UserRole.ADMIN),
  getFeeCategoriesController
);

router.get(
  '/:id',
  requireRole(UserRole.ADMIN),
  getFeeCategoryController
);

router.patch(
  '/:id',
  requireRole(UserRole.ADMIN),
  updateFeeCategoryController
);

router.delete(
  '/:id',
  requireRole(UserRole.ADMIN),
  deleteFeeCategoryController
);

export default router;