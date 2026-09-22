"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTeacherSchema = exports.createTeacherSchema = void 0;
const zod_1 = require("zod");
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
exports.createTeacherSchema = zod_1.z.object({
    userId: objectIdSchema,
    employeeNumber: zod_1.z
        .string()
        .trim()
        .max(50, 'Employee number cannot exceed 50 characters')
        .optional(),
    qualification: zod_1.z
        .string()
        .trim()
        .max(150, 'Qualification cannot exceed 150 characters')
        .optional(),
    phone: zod_1.z
        .string()
        .trim()
        .max(30, 'Phone number cannot exceed 30 characters')
        .optional(),
    address: zod_1.z
        .string()
        .trim()
        .max(250, 'Address cannot exceed 250 characters')
        .optional(),
    dateOfEmployment: dateStringSchema.optional(),
});
exports.updateTeacherSchema = zod_1.z
    .object({
    employeeNumber: zod_1.z
        .string()
        .trim()
        .max(50, 'Employee number cannot exceed 50 characters')
        .optional(),
    qualification: zod_1.z
        .string()
        .trim()
        .max(150, 'Qualification cannot exceed 150 characters')
        .optional(),
    phone: zod_1.z
        .string()
        .trim()
        .max(30, 'Phone number cannot exceed 30 characters')
        .optional(),
    address: zod_1.z
        .string()
        .trim()
        .max(250, 'Address cannot exceed 250 characters')
        .optional(),
    dateOfEmployment: dateStringSchema.optional(),
    isActive: zod_1.z
        .boolean()
        .optional(),
})
    .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required for an update',
});
