"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkCreateResultSchema = exports.bulkResultRecordSchema = exports.updateResultSchema = exports.createResultSchema = void 0;
const zod_1 = require("zod");
const result_model_1 = require("./result.model");
const objectIdSchema = zod_1.z
    .string()
    .regex(/^[a-fA-F0-9]{24}$/, 'Must be a valid ID');
const scoreSchema = (maximum, fieldName) => zod_1.z
    .number({
    message: `${fieldName} must be a number`,
})
    .min(0, `${fieldName} cannot be less than 0`)
    .max(maximum, `${fieldName} cannot exceed ${maximum}`);
const resultScoresSchema = {
    firstCA: scoreSchema(20, 'First CA').optional(),
    secondCA: scoreSchema(20, 'Second CA').optional(),
    exam: scoreSchema(60, 'Exam').optional(),
};
const remarkSchema = zod_1.z
    .string()
    .trim()
    .max(100, 'Remark cannot exceed 100 characters')
    .optional();
exports.createResultSchema = zod_1.z
    .object({
    studentId: objectIdSchema,
    classId: objectIdSchema,
    subjectId: objectIdSchema,
    academicSessionId: objectIdSchema,
    term: zod_1.z.enum(Object.values(result_model_1.ResultTerm)),
    ...resultScoresSchema,
    remark: remarkSchema,
})
    .refine((data) => data.firstCA !== undefined ||
    data.secondCA !== undefined ||
    data.exam !== undefined, {
    message: 'At least one score is required',
    path: ['firstCA'],
});
exports.updateResultSchema = zod_1.z
    .object({
    ...resultScoresSchema,
    remark: remarkSchema,
})
    .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required for an update',
});
exports.bulkResultRecordSchema = zod_1.z
    .object({
    studentId: objectIdSchema,
    ...resultScoresSchema,
    remark: remarkSchema,
})
    .refine((data) => data.firstCA !== undefined ||
    data.secondCA !== undefined ||
    data.exam !== undefined, {
    message: 'At least one score is required for this student',
    path: ['firstCA'],
});
exports.bulkCreateResultSchema = zod_1.z.object({
    classId: objectIdSchema,
    subjectId: objectIdSchema,
    academicSessionId: objectIdSchema,
    term: zod_1.z.enum(Object.values(result_model_1.ResultTerm)),
    records: zod_1.z
        .array(exports.bulkResultRecordSchema)
        .min(1, 'At least one result record is required'),
});
