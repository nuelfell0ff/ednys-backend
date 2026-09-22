"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAssignmentSchema = exports.createAssignmentSchema = void 0;
const zod_1 = require("zod");
const objectIdSchema = zod_1.z
    .string()
    .regex(/^[a-fA-F0-9]{24}$/, 'Must be a valid ID');
const dateStringSchema = zod_1.z
    .string()
    .datetime({
    message: 'Must be a valid date and time',
});
exports.createAssignmentSchema = zod_1.z.object({
    classId: objectIdSchema,
    subjectId: objectIdSchema,
    academicSessionId: objectIdSchema,
    title: zod_1.z
        .string()
        .trim()
        .min(1, 'Assignment title is required')
        .max(200, 'Assignment title cannot exceed 200 characters'),
    instructions: zod_1.z
        .string()
        .trim()
        .max(5000, 'Instructions cannot exceed 5000 characters')
        .optional(),
    dueDate: dateStringSchema,
    isPublished: zod_1.z
        .boolean()
        .optional(),
});
exports.updateAssignmentSchema = zod_1.z
    .object({
    title: zod_1.z
        .string()
        .trim()
        .min(1, 'Assignment title cannot be empty')
        .max(200, 'Assignment title cannot exceed 200 characters')
        .optional(),
    instructions: zod_1.z
        .string()
        .trim()
        .max(5000, 'Instructions cannot exceed 5000 characters')
        .optional(),
    dueDate: dateStringSchema.optional(),
    isPublished: zod_1.z
        .boolean()
        .optional(),
    isActive: zod_1.z
        .boolean()
        .optional(),
})
    .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required for an update',
});
