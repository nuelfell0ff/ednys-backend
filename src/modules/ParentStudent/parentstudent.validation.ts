import { z } from 'zod';

const objectIdSchema = z
  .string()
  .regex(
    /^[a-fA-F0-9]{24}$/,
    'Must be a valid ID'
  );

export const createParentStudentSchema =
  z.object({
    parentId: objectIdSchema,

    studentId: objectIdSchema,

    relationship: z.enum([
      'FATHER',
      'MOTHER',
      'GUARDIAN',
      'OTHER',
    ]),
  });

export const updateParentStudentSchema =
  z
    .object({
      relationship: z
        .enum([
          'FATHER',
          'MOTHER',
          'GUARDIAN',
          'OTHER',
        ])
        .optional(),

      isActive: z
        .boolean()
        .optional(),
    })
    .refine(
      (data) =>
        Object.keys(data).length > 0,
      {
        message:
          'At least one field is required for an update',
      }
    );

export type CreateParentStudentValidatedInput =
  z.infer<
    typeof createParentStudentSchema
  >;

export type UpdateParentStudentValidatedInput =
  z.infer<
    typeof updateParentStudentSchema
  >;