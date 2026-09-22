"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentQuerySchema = exports.createPaymentSchema = void 0;
const zod_1 = require("zod");
const payment_model_1 = require("./payment.model");
const objectIdSchema = zod_1.z
    .string()
    .regex(/^[a-fA-F0-9]{24}$/, 'Must be a valid ID');
exports.createPaymentSchema = zod_1.z.object({
    invoiceId: objectIdSchema,
    amount: zod_1.z
        .number()
        .positive('Payment amount must be greater than zero'),
    paymentMethod: zod_1.z.enum(Object.values(payment_model_1.PaymentMethod)),
    reference: zod_1.z
        .string()
        .trim()
        .min(1, 'Payment reference cannot be empty')
        .max(150, 'Payment reference cannot exceed 150 characters')
        .optional(),
});
exports.paymentQuerySchema = zod_1.z.object({
    invoiceId: objectIdSchema.optional(),
    studentId: objectIdSchema.optional(),
    paymentMethod: zod_1.z
        .enum(Object.values(payment_model_1.PaymentMethod))
        .optional(),
    status: zod_1.z
        .enum(Object.values(payment_model_1.PaymentStatus))
        .optional(),
});
