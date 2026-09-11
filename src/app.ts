import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import schoolRoutes from './modules/schools/school.routes';
import authRoutes from './modules/auth/auth.routes';
import studentRoutes from './modules/students/student.routes';
import academicSessionRoutes from './modules/academic-sessions/academic-session.routes';


const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
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

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/v1/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'EDNYS API is running',
    environment: process.env.NODE_ENV || 'development',
  });
});


app.use('/api/v1/schools', schoolRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/academic-sessions', academicSessionRoutes);

export default app;