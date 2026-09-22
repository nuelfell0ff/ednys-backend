"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTeacherUserSchema = exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .trim()
        .min(1, 'Name is required')
        .max(150, 'Name cannot exceed 150 characters'),
    email: zod_1.z
        .string()
        .trim()
        .email('Must be a valid email address')
        .max(150, 'Email cannot exceed 150 characters'),
    password: zod_1.z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(100, 'Password cannot exceed 100 characters'),
    role: zod_1.z.enum([
        'ADMIN',
        'TEACHER',
        'PARENT',
    ]),
});
exports.updateUserSchema = zod_1.z
    .object({
    name: zod_1.z
        .string()
        .trim()
        .min(1, 'Name cannot be empty')
        .max(150, 'Name cannot exceed 150 characters')
        .optional(),
    email: zod_1.z
        .string()
        .trim()
        .email('Must be a valid email address')
        .max(150, 'Email cannot exceed 150 characters')
        .optional(),
    role: zod_1.z
        .enum([
        'ADMIN',
        'TEACHER',
        'PARENT',
    ])
        .optional(),
    isActive: zod_1.z
        .boolean()
        .optional(),
})
    .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required for an update',
});
exports.createTeacherUserSchema = exports.createUserSchema.extend({
    role: zod_1.z.literal('TEACHER'),
});
