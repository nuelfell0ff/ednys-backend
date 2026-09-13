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

      remark: z
        .string()
        .trim()
        .max(
          100,
          'Remark cannot exceed 100 characters'
        )
        .optional(),
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

      remark: z
        .string()
        .trim()
        .max(
          100,
          'Remark cannot exceed 100 characters'
        )
        .optional(),
    })
    .refine(
      (data) => Object.keys(data).length > 0,
      {
        message:
          'At least one field is required for an update',
      }
    );

export type CreateResultValidatedInput =
  z.infer<typeof createResultSchema>;

export type UpdateResultValidatedInput =
  z.infer<typeof updateResultSchema>;