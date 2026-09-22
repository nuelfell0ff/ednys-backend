import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import {
  authenticate,
} from './middleware/auth.middleware';

import {
  tenantMiddleware,
} from './middleware/tenant.middleware';

import schoolRoutes from './modules/schools/school.routes';
import authRoutes from './modules/auth/auth.routes';
import studentRoutes from './modules/students/student.routes';
import academicSessionRoutes from './modules/academic-sessions/academic-session.routes';
import classRoutes from './modules/classes/class.routes';
import subjectRoutes from './modules/subjects/subject.routes';
import teacherRoutes from './modules/teachers/teacher.routes';
import userRoutes from './modules/users/user.routes';
import teacherAssignmentRoutes from './modules/teacher-assignments/teacher-assignment.routes';
import assignmentRoutes from './modules/assignments/assignment.routes';
import attendanceRoutes from './modules/attendance/attendance.routes';
import resultRoutes from './modules/results/result.routes';
import parentRoutes from './modules/parents/parent.routes';
import parentStudentRoutes from './modules/ParentStudent/parentstudent.routes';
import feeCategoryRoutes from './modules/fee-categories/fee-category.routes';
import feeStructureRoutes from './modules/fee-structures/fee-structure.routes';
import invoiceRoutes from './modules/invoices/invoice.routes';
import paymentRoutes from './modules/payments/payment.routes';
import schoolPaymentConfigRoutes from './modules/school-payment-config/school-payment-config.routes';
import platformPaymentConfigRoutes from './modules/platform-payment-config/platform-payment-config.routes';

import {
  paystackWebhookController,
} from './modules/payments/paystack-webhook.controller';

const app = express();

app.use(helmet());

app.use(
  cors({
    origin:
      process.env.CORS_ORIGIN ||
      'http://localhost:3000',
    credentials: true,
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.post(
  '/api/v1/payments/paystack/webhook',
  express.raw({
    type: 'application/json',
    limit: '1mb',
  }),
  paystackWebhookController
);

app.use(
  express.json({
    limit: '1mb',
  })
);

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(
  tenantMiddleware
);

app.get(
  '/api/v1/health',
  (_req, res) => {
    res.status(200).json({
      success: true,
      message: 'EDNYS API is running',
      environment:
        process.env.NODE_ENV ||
        'development',
    });
  }
);

app.get(
  '/api/v1/tenant-test',
  authenticate,
  (req, res) => {
    res.status(200).json({
      success: true,
      host: req.headers.host,
      tenant: req.school
        ? {
            id: req.school._id,
            name: req.school.name,
            slug: req.school.slug,
            subdomain:
              req.school.subdomain,
            isActive:
              req.school.isActive,
          }
        : null,
    });
  }
);

app.use(
  '/api/v1/schools',
  schoolRoutes
);

app.use(
  '/api/v1/auth',
  authRoutes
);

app.use(
  '/api/v1/students',
  studentRoutes
);

app.use(
  '/api/v1/academic-sessions',
  academicSessionRoutes
);

app.use(
  '/api/v1/classes',
  classRoutes
);

app.use(
  '/api/v1/subjects',
  subjectRoutes
);

app.use(
  '/api/v1/teachers',
  teacherRoutes
);

app.use(
  '/api/v1/users',
  userRoutes
);

app.use(
  '/api/v1/teacher-assignments',
  teacherAssignmentRoutes
);

app.use(
  '/api/v1/assignments',
  assignmentRoutes
);

app.use(
  '/api/v1/attendance',
  attendanceRoutes
);

app.use(
  '/api/v1/results',
  resultRoutes
);

app.use(
  '/api/v1/parents',
  parentRoutes
);

app.use(
  '/api/v1/parent-students',
  parentStudentRoutes
);

app.use(
  '/api/v1/fee-categories',
  feeCategoryRoutes
);

app.use(
  '/api/v1/fee-structures',
  feeStructureRoutes
);

app.use(
  '/api/v1/invoices',
  invoiceRoutes
);

app.use(
  '/api/v1/payments',
  paymentRoutes
);

app.use(
  '/api/v1/school-payment-config',
  schoolPaymentConfigRoutes
);

app.use(
  '/api/v1/platform-payment-config',
  platformPaymentConfigRoutes
);

export default app;