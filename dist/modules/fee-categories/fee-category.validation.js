"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFeeCategorySchema = exports.createFeeCategorySchema = void 0;
const zod_1 = require("zod");
exports.createFeeCategorySchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .trim()
        .min(1, 'Fee category name is required')
        .max(100, 'Fee category name cannot exceed 100 characters'),
    description: zod_1.z
        .string()
        .trim()
        .max(250, 'Description cannot exceed 250 characters')
        .optional(),
});
exports.updateFeeCategorySchema = zod_1.z
    .object({
    name: zod_1.z
        .string()
        .trim()
        .min(1, 'Fee category name is required')
        .max(100, 'Fee category name cannot exceed 100 characters')
        .optional(),
    description: zod_1.z
        .string()
        .trim()
        .max(250, 'Description cannot exceed 250 characters')
        .optional(),
    isActive: zod_1.z
        .boolean()
        .optional(),
})
    .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required for an update',
});
