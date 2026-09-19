import { Router } from 'express';

import {
  createPaymentController,
  getPaymentController,
  getPaymentsController,
} from './payment.controller';

import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role.middleware';
import { UserRole } from '../users/user.model';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  requireRole(UserRole.ADMIN),
  createPaymentController
);

router.get(
  '/',
  requireRole(UserRole.ADMIN),
  getPaymentsController
);

router.get(
  '/:id',
  requireRole(UserRole.ADMIN),
  getPaymentController
);

export default router;