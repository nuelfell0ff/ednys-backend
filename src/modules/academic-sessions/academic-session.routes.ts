import { Router } from 'express';

import {
  createAcademicSessionController,
  deleteAcademicSessionController,
  getAcademicSessionController,
  getAcademicSessionsController,
  getActiveAcademicSessionController,
  updateAcademicSessionController,
} from './academic-session.controller';

import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role.middleware';
import { UserRole } from '../users/user.model';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  requireRole(UserRole.ADMIN),
  createAcademicSessionController
);

router.get(
  '/',
  getAcademicSessionsController
);

router.get(
  '/active',
  getActiveAcademicSessionController
);

router.get(
  '/:id',
  getAcademicSessionController
);

router.patch(
  '/:id',
  requireRole(UserRole.ADMIN),
  updateAcademicSessionController
);

router.delete(
  '/:id',
  requireRole(UserRole.ADMIN),
  deleteAcademicSessionController
);

export default router;