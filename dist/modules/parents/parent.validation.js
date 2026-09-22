"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateParentSchema = exports.createParentSchema = void 0;
const zod_1 = require("zod");
const objectIdSchema = zod_1.z
    .string()
    .regex(/^[a-fA-F0-9]{24}$/, 'Must be a valid ID');
exports.createParentSchema = zod_1.z.object({
    userId: objectIdSchema,
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
    occupation: zod_1.z
        .string()
        .trim()
        .max(100, 'Occupation cannot exceed 100 characters')
        .optional(),
});
exports.updateParentSchema = zod_1.z
    .object({
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
    occupation: zod_1.z
        .string()
        .trim()
        .max(100, 'Occupation cannot exceed 100 characters')
        .optional(),
    isActive: zod_1.z.boolean().optional(),
})
    .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required for an update',
});
