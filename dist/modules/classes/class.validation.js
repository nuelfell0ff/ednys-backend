"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateClassSchema = exports.createClassSchema = void 0;
const zod_1 = require("zod");
const objectIdSchema = zod_1.z
    .string()
    .regex(/^[a-fA-F0-9]{24}$/, 'Must be a valid ID');
exports.createClassSchema = zod_1.z.object({
    academicSessionId: objectIdSchema,
    name: zod_1.z
        .string()
        .trim()
        .min(1, 'Class name is required')
        .max(100, 'Class name cannot exceed 100 characters'),
    code: zod_1.z
        .string()
        .trim()
        .max(50, 'Class code cannot exceed 50 characters')
        .optional(),
    level: zod_1.z
        .string()
        .trim()
        .max(50, 'Class level cannot exceed 50 characters')
        .optional(),
    capacity: zod_1.z
        .number()
        .int('Class capacity must be a whole number')
        .min(1, 'Class capacity must be at least 1')
        .optional(),
});
exports.updateClassSchema = zod_1.z
    .object({
    academicSessionId: objectIdSchema.optional(),
    name: zod_1.z
        .string()
        .trim()
        .min(1, 'Class name cannot be empty')
        .max(100, 'Class name cannot exceed 100 characters')
        .optional(),
    code: zod_1.z
        .string()
        .trim()
        .max(50, 'Class code cannot exceed 50 characters')
        .optional(),
    level: zod_1.z
        .string()
        .trim()
        .max(50, 'Class level cannot exceed 50 characters')
        .optional(),
    capacity: zod_1.z
        .number()
        .int('Class capacity must be a whole number')
        .min(1, 'Class capacity must be at least 1')
        .optional(),
    isActive: zod_1.z
        .boolean()
        .optional(),
})
    .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required for an update',
});
