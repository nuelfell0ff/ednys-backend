import { z } from 'zod';

import { ResultTerm } from './result.model';

const objectIdSchema = z
  .string()
  .regex(
    /^[a-fA-F0-9]{24}$/,
    'Must be a valid ID'
  );

const scoreSchema = (
  maximum: number,
  fieldName: string
) =>
  z
    .number({
      message: `${fieldName} must be a number`,
    })
    .min(
      0,
      `${fieldName} cannot be less than 0`
    )
    .max(
      maximum,
      `${fieldName} cannot exceed ${maximum}`
    );

const resultScoresSchema = {
  firstCA: scoreSchema(
    20,
    'First CA'
  ).optional(),

  secondCA: scoreSchema(
    20,
    'Second CA'
  ).optional(),

  exam: scoreSchema(
    60,
    'Exam'
  ).optional(),
};

const remarkSchema = z
  .string()
  .trim()
  .max(
    100,
    'Remark cannot exceed 100 characters'
  )
  .optional();

export const createResultSchema =
  z
    .object({
      studentId: objectIdSchema,

      classId: objectIdSchema,

      subjectId: objectIdSchema,

      academicSessionId: objectIdSchema,

      term: z.enum(
        Object.values(ResultTerm) as [
          ResultTerm,
          ...ResultTerm[],
        ]
      ),

      ...resultScoresSchema,

      remark: remarkSchema,
    })
    .refine(
      (data) =>
        data.firstCA !== undefined ||
        data.secondCA !== undefined ||
        data.exam !== undefined,
      {
        message:
          'At least one score is required',
        path: ['firstCA'],
      }
    );

export const updateResultSchema =
  z
    .object({
      ...resultScoresSchema,

      remark: remarkSchema,
    })
    .refine(
      (data) =>
        Object.keys(data).length > 0,
      {
        message:
          'At least one field is required for an update',
      }
    );

export const bulkResultRecordSchema =
  z
    .object({
      studentId: objectIdSchema,

      ...resultScoresSchema,

      remark: remarkSchema,
    })
    .refine(
      (data) =>
        data.firstCA !== undefined ||
        data.secondCA !== undefined ||
        data.exam !== undefined,
      {
        message:
          'At least one score is required for this student',
        path: ['firstCA'],
      }
    );

export const bulkCreateResultSchema =
  z.object({
    classId: objectIdSchema,

    subjectId: objectIdSchema,

    academicSessionId:
      objectIdSchema,

    term: z.enum(
      Object.values(ResultTerm) as [
        ResultTerm,
        ...ResultTerm[],
      ]
    ),

    records: z
      .array(
        bulkResultRecordSchema
      )
      .min(
        1,
        'At least one result record is required'
      ),
  });

export type CreateResultValidatedInput =
  z.infer<
    typeof createResultSchema
  >;

export type UpdateResultValidatedInput =
  z.infer<
    typeof updateResultSchema
  >;

export type BulkResultRecordValidatedInput =
  z.infer<
    typeof bulkResultRecordSchema
  >;

export type BulkCreateResultValidatedInput =
  z.infer<
    typeof bulkCreateResultSchema
  >;