"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSubjectSchema = exports.createSubjectSchema = void 0;
const zod_1 = require("zod");
exports.createSubjectSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .trim()
        .min(1, 'Subject name is required')
        .max(100, 'Subject name cannot exceed 100 characters'),
    code: zod_1.z
        .string()
        .trim()
        .max(50, 'Subject code cannot exceed 50 characters')
        .optional(),
    description: zod_1.z
        .string()
        .trim()
        .max(500, 'Subject description cannot exceed 500 characters')
        .optional(),
});
exports.updateSubjectSchema = zod_1.z
    .object({
    name: zod_1.z
        .string()
        .trim()
        .min(1, 'Subject name cannot be empty')
        .max(100, 'Subject name cannot exceed 100 characters')
        .optional(),
    code: zod_1.z
        .string()
        .trim()
        .max(50, 'Subject code cannot exceed 50 characters')
        .optional(),
    description: zod_1.z
        .string()
        .trim()
        .max(500, 'Subject description cannot exceed 500 characters')
        .optional(),
    isActive: zod_1.z
        .boolean()
        .optional(),
})
    .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required for an update',
});
