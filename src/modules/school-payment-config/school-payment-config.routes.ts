import { Router } from 'express';

import {
  createSchoolPaymentConfigController,
  disableSchoolPaymentConfigController,
  getSchoolPaymentConfigController,
  updateSchoolPaymentConfigController,
} from './school-payment-config.controller';

import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role.middleware';
import { UserRole } from '../users/user.model';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  requireRole(UserRole.ADMIN),
  createSchoolPaymentConfigController
);

router.get(
  '/',
  requireRole(UserRole.ADMIN),
  getSchoolPaymentConfigController
);

router.patch(
  '/',
  requireRole(UserRole.ADMIN),
  updateSchoolPaymentConfigController
);

router.patch(
  '/disable',
  requireRole(UserRole.ADMIN),
  disableSchoolPaymentConfigController
);

export default router;