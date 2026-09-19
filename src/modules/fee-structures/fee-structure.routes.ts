import { Router } from 'express';

import {
  createFeeStructureController,
  deleteFeeStructureController,
  getFeeStructureController,
  getFeeStructuresController,
  updateFeeStructureController,
} from './fee-structure.controller';

import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role.middleware';
import { UserRole } from '../users/user.model';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  requireRole(UserRole.ADMIN),
  createFeeStructureController
);

router.get(
  '/',
  requireRole(UserRole.ADMIN),
  getFeeStructuresController
);

router.get(
  '/:id',
  requireRole(UserRole.ADMIN),
  getFeeStructureController
);

router.patch(
  '/:id',
  requireRole(UserRole.ADMIN),
  updateFeeStructureController
);

router.delete(
  '/:id',
  requireRole(UserRole.ADMIN),
  deleteFeeStructureController
);

export default router;