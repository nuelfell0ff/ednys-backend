"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFeeStructureSchema = exports.createFeeStructureSchema = void 0;
const zod_1 = require("zod");
const result_model_1 = require("../results/result.model");
const objectIdSchema = zod_1.z
    .string()
    .regex(/^[a-fA-F0-9]{24}$/, 'Must be a valid ID');
const dateStringSchema = zod_1.z
    .string()
    .refine((value) => {
    const date = new Date(value);
    return !Number.isNaN(date.getTime());
}, {
    message: 'Must be a valid date',
});
exports.createFeeStructureSchema = zod_1.z.object({
    academicSessionId: objectIdSchema,
    term: zod_1.z.enum(Object.values(result_model_1.ResultTerm)),
    classId: objectIdSchema,
    feeCategoryId: objectIdSchema,
    amount: zod_1.z
        .number()
        .min(0, 'Amount cannot be negative'),
    dueDate: dateStringSchema.optional(),
    isMandatory: zod_1.z.boolean().optional(),
});
exports.updateFeeStructureSchema = zod_1.z
    .object({
    academicSessionId: objectIdSchema.optional(),
    term: zod_1.z
        .enum(Object.values(result_model_1.ResultTerm))
        .optional(),
    classId: objectIdSchema.optional(),
    feeCategoryId: objectIdSchema.optional(),
    amount: zod_1.z
        .number()
        .min(0, 'Amount cannot be negative')
        .optional(),
    dueDate: dateStringSchema.optional(),
    isMandatory: zod_1.z.boolean().optional(),
    isActive: zod_1.z.boolean().optional(),
})
    .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required for an update',
});
