"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const school_routes_1 = __importDefault(require("./modules/schools/school.routes"));
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const student_routes_1 = __importDefault(require("./modules/students/student.routes"));
const academic_session_routes_1 = __importDefault(require("./modules/academic-sessions/academic-session.routes"));
const class_routes_1 = __importDefault(require("./modules/classes/class.routes"));
const subject_routes_1 = __importDefault(require("./modules/subjects/subject.routes"));
const teacher_routes_1 = __importDefault(require("./modules/teachers/teacher.routes"));
const user_routes_1 = __importDefault(require("./modules/users/user.routes"));
const teacher_assignment_routes_1 = __importDefault(require("./modules/teacher-assignments/teacher-assignment.routes"));
const assignment_routes_1 = __importDefault(require("./modules/assignments/assignment.routes"));
const attendance_routes_1 = __importDefault(require("./modules/attendance/attendance.routes"));
const result_routes_1 = __importDefault(require("./modules/results/result.routes"));
const parent_routes_1 = __importDefault(require("./modules/parents/parent.routes"));
const parentstudent_routes_1 = __importDefault(require("./modules/ParentStudent/parentstudent.routes"));
const fee_category_routes_1 = __importDefault(require("./modules/fee-categories/fee-category.routes"));
const fee_structure_routes_1 = __importDefault(require("./modules/fee-structures/fee-structure.routes"));
const invoice_routes_1 = __importDefault(require("./modules/invoices/invoice.routes"));
const payment_routes_1 = __importDefault(require("./modules/payments/payment.routes"));
const school_payment_config_routes_1 = __importDefault(require("./modules/school-payment-config/school-payment-config.routes"));
const platform_payment_config_routes_1 = __importDefault(require("./modules/platform-payment-config/platform-payment-config.routes"));
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
}));
app.use((0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    standardHeaders: true,
    legacyHeaders: false,
}));
app.use(express_1.default.json({ limit: '1mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/api/v1/health', (_req, res) => {
    res.status(200).json({
        success: true,
        message: 'EDNYS API is running',
        environment: process.env.NODE_ENV || 'development',
    });
});
app.use('/api/v1/schools', school_routes_1.default);
app.use('/api/v1/auth', auth_routes_1.default);
app.use('/api/v1/students', student_routes_1.default);
app.use('/api/v1/academic-sessions', academic_session_routes_1.default);
app.use('/api/v1/classes', class_routes_1.default);
app.use('/api/v1/subjects', subject_routes_1.default);
app.use('/api/v1/teachers', teacher_routes_1.default);
app.use('/api/v1/users', user_routes_1.default);
app.use('/api/v1/teacher-assignments', teacher_assignment_routes_1.default);
app.use('/api/v1/assignments', assignment_routes_1.default);
app.use('/api/v1/attendance', attendance_routes_1.default);
app.use('/api/v1/results', result_routes_1.default);
app.use('/api/v1/parents', parent_routes_1.default);
app.use('/api/v1/parent-students', parentstudent_routes_1.default);
app.use('/api/v1/fee-categories', fee_category_routes_1.default);
app.use('/api/v1/fee-structures', fee_structure_routes_1.default);
app.use('/api/v1/invoices', invoice_routes_1.default);
app.use('/api/v1/payments', payment_routes_1.default);
app.use('/api/v1/school-payment-config', school_payment_config_routes_1.default);
app.use('/api/v1/platform-payment-config', platform_payment_config_routes_1.default);
exports.default = app;
