import { Router } from 'express';

import {
  createPlatformPaymentConfigController,
  disablePlatformPaymentConfigController,
  getPlatformPaymentConfigController,
  updatePlatformPaymentConfigController,
} from './platform-payment-config.controller';

import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role.middleware';
import { UserRole } from '../users/user.model';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  requireRole(UserRole.SUPER_ADMIN),
  createPlatformPaymentConfigController
);

router.get(
  '/',
  requireRole(UserRole.SUPER_ADMIN),
  getPlatformPaymentConfigController
);

router.patch(
  '/',
  requireRole(UserRole.SUPER_ADMIN),
  updatePlatformPaymentConfigController
);

router.patch(
  '/disable',
  requireRole(UserRole.SUPER_ADMIN),
  disablePlatformPaymentConfigController
);

export default router;