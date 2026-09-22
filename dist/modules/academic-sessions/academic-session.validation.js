"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAcademicSessionSchema = exports.createAcademicSessionSchema = void 0;
const zod_1 = require("zod");
exports.createAcademicSessionSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .trim()
        .min(1, 'Academic session name is required')
        .max(50, 'Academic session name cannot exceed 50 characters'),
    startDate: zod_1.z
        .string()
        .datetime({
        message: 'Start date must be a valid date',
    }),
    endDate: zod_1.z
        .string()
        .datetime({
        message: 'End date must be a valid date',
    }),
    isActive: zod_1.z
        .boolean()
        .optional(),
});
exports.updateAcademicSessionSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .trim()
        .min(1, 'Academic session name cannot be empty')
        .max(50, 'Academic session name cannot exceed 50 characters')
        .optional(),
    startDate: zod_1.z
        .string()
        .datetime({
        message: 'Start date must be a valid date',
    })
        .optional(),
    endDate: zod_1.z
        .string()
        .datetime({
        message: 'End date must be a valid date',
    })
        .optional(),
    isActive: zod_1.z
        .boolean()
        .optional(),
})
    .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required for an update',
});
