"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTeacherAssignmentSchema = exports.createTeacherAssignmentSchema = void 0;
const zod_1 = require("zod");
const objectIdSchema = zod_1.z
    .string()
    .regex(/^[a-fA-F0-9]{24}$/, 'Must be a valid ID');
exports.createTeacherAssignmentSchema = zod_1.z.object({
    teacherId: objectIdSchema,
    classId: objectIdSchema,
    subjectId: objectIdSchema,
    academicSessionId: objectIdSchema,
});
exports.updateTeacherAssignmentSchema = zod_1.z
    .object({
    isActive: zod_1.z.boolean().optional(),
})
    .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required for an update',
});
