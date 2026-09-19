import { Router } from 'express';

import {
  cancelInvoiceController,
  createInvoiceController,
  getInvoiceController,
  getInvoicesController,
} from './invoice.controller';

import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role.middleware';
import { UserRole } from '../users/user.model';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  requireRole(UserRole.ADMIN),
  createInvoiceController
);

router.get(
  '/',
  requireRole(UserRole.ADMIN),
  getInvoicesController
);

router.get(
  '/:id',
  requireRole(UserRole.ADMIN),
  getInvoiceController
);

router.patch(
  '/:id/cancel',
  requireRole(UserRole.ADMIN),
  cancelInvoiceController
);

export default router;