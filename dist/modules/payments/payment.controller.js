"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentController = exports.getPaymentsController = exports.createPaymentController = void 0;
const payment_service_1 = require("./payment.service");
const payment_validation_1 = require("./payment.validation");
const getSchoolId = (req) => {
    if (!req.user?.schoolId) {
        return null;
    }
    return req.user.schoolId;
};
const getPaymentId = (req) => {
    const { id } = req.params;
    if (typeof id !== 'string' ||
        !id.trim()) {
        return null;
    }
    return id;
};
const createPaymentController = async (req, res) => {
    const schoolId = getSchoolId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    const validationResult = payment_validation_1.createPaymentSchema.safeParse(req.body);
    if (!validationResult.success) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: validationResult.error.flatten(),
        });
        return;
    }
    try {
        const payment = await (0, payment_service_1.createPayment)(schoolId, validationResult.data);
        res.status(201).json({
            success: true,
            message: 'Payment created successfully',
            data: payment,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to create payment',
        });
    }
};
exports.createPaymentController = createPaymentController;
const getPaymentsController = async (req, res) => {
    const schoolId = getSchoolId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    const validationResult = payment_validation_1.paymentQuerySchema.safeParse(req.query);
    if (!validationResult.success) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: validationResult.error.flatten(),
        });
        return;
    }
    try {
        const payments = await (0, payment_service_1.getPayments)(schoolId, validationResult.data);
        res.status(200).json({
            success: true,
            data: payments,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to retrieve payments',
        });
    }
};
exports.getPaymentsController = getPaymentsController;
const getPaymentController = async (req, res) => {
    const schoolId = getSchoolId(req);
    const paymentId = getPaymentId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    if (!paymentId) {
        res.status(400).json({
            success: false,
            message: 'Payment ID is required',
        });
        return;
    }
    try {
        const payment = await (0, payment_service_1.getPaymentById)(paymentId, schoolId);
        res.status(200).json({
            success: true,
            data: payment,
        });
    }
    catch (error) {
        const message = error instanceof Error
            ? error.message
            : 'Failed to retrieve payment';
        res.status(message === 'Payment not found'
            ? 404
            : 400).json({
            success: false,
            message,
        });
    }
};
exports.getPaymentController = getPaymentController;
