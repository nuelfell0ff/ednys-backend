import { Router } from 'express';

import {
  createSubjectController,
  deleteSubjectController,
  getSubjectController,
  getSubjectsController,
  updateSubjectController,
} from './subject.controller';

import { authenticate } from '../../middleware/auth.middleware';
import { requireRole } from '../../middleware/role.middleware';
import { UserRole } from '../users/user.model';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  requireRole(UserRole.ADMIN),
  createSubjectController
);

router.get(
  '/',
  getSubjectsController
);

router.get(
  '/:id',
  getSubjectController
);

router.patch(
  '/:id',
  requireRole(UserRole.ADMIN),
  updateSubjectController
);

router.delete(
  '/:id',
  requireRole(UserRole.ADMIN),
  deleteSubjectController
);

export default router;