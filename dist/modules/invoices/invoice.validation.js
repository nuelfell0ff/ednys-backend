"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelInvoiceSchema = exports.invoiceQuerySchema = exports.createInvoiceSchema = void 0;
const zod_1 = require("zod");
const result_model_1 = require("../results/result.model");
const invoice_model_1 = require("./invoice.model");
const objectIdSchema = zod_1.z
    .string()
    .regex(/^[a-fA-F0-9]{24}$/, 'Must be a valid ID');
exports.createInvoiceSchema = zod_1.z.object({
    studentId: objectIdSchema,
    academicSessionId: objectIdSchema,
    term: zod_1.z.enum(Object.values(result_model_1.ResultTerm)),
});
exports.invoiceQuerySchema = zod_1.z.object({
    studentId: objectIdSchema.optional(),
    academicSessionId: objectIdSchema.optional(),
    term: zod_1.z
        .enum(Object.values(result_model_1.ResultTerm))
        .optional(),
    status: zod_1.z
        .enum(Object.values(invoice_model_1.InvoiceStatus))
        .optional(),
});
exports.cancelInvoiceSchema = zod_1.z.object({
    reason: zod_1.z
        .string()
        .trim()
        .max(250, 'Cancellation reason cannot exceed 250 characters')
        .optional(),
});
