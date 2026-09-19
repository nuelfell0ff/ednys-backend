import { z } from 'zod';

import { ResultTerm } from '../results/result.model';

const objectIdSchema = z
  .string()
  .regex(
    /^[a-fA-F0-9]{24}$/,
    'Must be a valid ID'
  );

const dateStringSchema = z
  .string()
  .refine(
    (value) => {
      const date = new Date(value);

      return !Number.isNaN(
        date.getTime()
      );
    },
    {
      message: 'Must be a valid date',
    }
  );

export const createFeeStructureSchema =
  z.object({
    academicSessionId: objectIdSchema,

    term: z.enum(
      Object.values(ResultTerm) as [
        ResultTerm,
        ...ResultTerm[]
      ]
    ),

    classId: objectIdSchema,

    feeCategoryId: objectIdSchema,

    amount: z
      .number()
      .min(
        0,
        'Amount cannot be negative'
      ),

    dueDate:
      dateStringSchema.optional(),

    isMandatory:
      z.boolean().optional(),
  });

export const updateFeeStructureSchema =
  z
    .object({
      academicSessionId:
        objectIdSchema.optional(),

      term: z
        .enum(
          Object.values(ResultTerm) as [
            ResultTerm,
            ...ResultTerm[]
          ]
        )
        .optional(),

      classId:
        objectIdSchema.optional(),

      feeCategoryId:
        objectIdSchema.optional(),

      amount: z
        .number()
        .min(
          0,
          'Amount cannot be negative'
        )
        .optional(),

      dueDate:
        dateStringSchema.optional(),

      isMandatory:
        z.boolean().optional(),

      isActive:
        z.boolean().optional(),
    })
    .refine(
      (data) =>
        Object.keys(data).length > 0,
      {
        message:
          'At least one field is required for an update',
      }
    );

export type CreateFeeStructureValidatedInput =
  z.infer<
    typeof createFeeStructureSchema
  >;

export type UpdateFeeStructureValidatedInput =
  z.infer<
    typeof updateFeeStructureSchema
  >;