import { Router } from 'express';
import {
  createSchoolController,
  getSchoolController,
  updateSchoolController,
} from './school.controller';

const router = Router();

router.post('/', createSchoolController);
router.get('/:id', getSchoolController);
router.patch('/:id', updateSchoolController);

export default router;