"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateParentStudentSchema = exports.createParentStudentSchema = void 0;
const zod_1 = require("zod");
const objectIdSchema = zod_1.z
    .string()
    .regex(/^[a-fA-F0-9]{24}$/, 'Must be a valid ID');
exports.createParentStudentSchema = zod_1.z.object({
    parentId: objectIdSchema,
    studentId: objectIdSchema,
    relationship: zod_1.z.enum([
        'FATHER',
        'MOTHER',
        'GUARDIAN',
        'OTHER',
    ]),
});
exports.updateParentStudentSchema = zod_1.z
    .object({
    relationship: zod_1.z
        .enum([
        'FATHER',
        'MOTHER',
        'GUARDIAN',
        'OTHER',
    ])
        .optional(),
    isActive: zod_1.z
        .boolean()
        .optional(),
})
    .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required for an update',
});
