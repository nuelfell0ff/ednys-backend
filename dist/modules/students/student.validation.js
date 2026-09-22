"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStudentSchema = exports.createStudentSchema = void 0;
const zod_1 = require("zod");
const objectIdSchema = zod_1.z
    .string()
    .regex(/^[a-fA-F0-9]{24}$/, 'Must be a valid ID');
exports.createStudentSchema = zod_1.z.object({
    admissionNumber: zod_1.z
        .string()
        .trim()
        .min(1, 'Admission number is required')
        .max(50, 'Admission number cannot exceed 50 characters'),
    firstName: zod_1.z
        .string()
        .trim()
        .min(1, 'First name is required')
        .max(100, 'First name cannot exceed 100 characters'),
    middleName: zod_1.z
        .string()
        .trim()
        .max(100, 'Middle name cannot exceed 100 characters')
        .optional(),
    lastName: zod_1.z
        .string()
        .trim()
        .min(1, 'Last name is required')
        .max(100, 'Last name cannot exceed 100 characters'),
    dateOfBirth: zod_1.z
        .string()
        .datetime({
        message: 'Date of birth must be a valid date',
    })
        .optional(),
    gender: zod_1.z
        .enum(['MALE', 'FEMALE'])
        .optional(),
    classId: objectIdSchema.optional(),
    academicSessionId: objectIdSchema.optional(),
});
exports.updateStudentSchema = zod_1.z
    .object({
    admissionNumber: zod_1.z
        .string()
        .trim()
        .min(1, 'Admission number cannot be empty')
        .max(50, 'Admission number cannot exceed 50 characters')
        .optional(),
    firstName: zod_1.z
        .string()
        .trim()
        .min(1, 'First name cannot be empty')
        .max(100, 'First name cannot exceed 100 characters')
        .optional(),
    middleName: zod_1.z
        .string()
        .trim()
        .max(100, 'Middle name cannot exceed 100 characters')
        .optional(),
    lastName: zod_1.z
        .string()
        .trim()
        .min(1, 'Last name cannot be empty')
        .max(100, 'Last name cannot exceed 100 characters')
        .optional(),
    dateOfBirth: zod_1.z
        .string()
        .datetime({
        message: 'Date of birth must be a valid date',
    })
        .optional(),
    gender: zod_1.z
        .enum(['MALE', 'FEMALE'])
        .optional(),
    classId: objectIdSchema.optional(),
    academicSessionId: objectIdSchema.optional(),
    isActive: zod_1.z
        .boolean()
        .optional(),
})
    .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required for an update',
});
