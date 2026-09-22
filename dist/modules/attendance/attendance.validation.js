"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkAttendanceSchema = exports.bulkAttendanceRecordSchema = exports.updateAttendanceSchema = exports.createAttendanceSchema = void 0;
const zod_1 = require("zod");
const attendance_model_1 = require("./attendance.model");
const objectIdSchema = zod_1.z
    .string()
    .regex(/^[a-fA-F0-9]{24}$/, 'Must be a valid ID');
const dateStringSchema = zod_1.z
    .string()
    .datetime({
    message: 'Must be a valid date and time',
});
exports.createAttendanceSchema = zod_1.z.object({
    studentId: objectIdSchema,
    classId: objectIdSchema,
    academicSessionId: objectIdSchema,
    date: dateStringSchema,
    status: zod_1.z.enum(Object.values(attendance_model_1.AttendanceStatus)),
    remarks: zod_1.z
        .string()
        .trim()
        .max(500, 'Remarks cannot exceed 500 characters')
        .optional(),
});
exports.updateAttendanceSchema = zod_1.z
    .object({
    status: zod_1.z
        .enum(Object.values(attendance_model_1.AttendanceStatus))
        .optional(),
    remarks: zod_1.z
        .string()
        .trim()
        .max(500, 'Remarks cannot exceed 500 characters')
        .optional(),
})
    .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required for an update',
});
exports.bulkAttendanceRecordSchema = zod_1.z.object({
    studentId: objectIdSchema,
    status: zod_1.z.enum(Object.values(attendance_model_1.AttendanceStatus)),
    remarks: zod_1.z
        .string()
        .trim()
        .max(500, 'Remarks cannot exceed 500 characters')
        .optional(),
});
exports.bulkAttendanceSchema = zod_1.z.object({
    classId: objectIdSchema,
    academicSessionId: objectIdSchema,
    date: dateStringSchema,
    records: zod_1.z
        .array(exports.bulkAttendanceRecordSchema)
        .min(1, 'At least one attendance record is required'),
});
