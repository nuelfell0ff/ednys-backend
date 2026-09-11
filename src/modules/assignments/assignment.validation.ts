import { z } from 'zod';

const objectIdSchema = z
  .string()
  .regex(
    /^[a-fA-F0-9]{24}$/,
    'Must be a valid ID'
  );

const dateStringSchema = z
  .string()
  .datetime({
    message: 'Must be a valid date and time',
  });

export const createAssignmentSchema =
  z.object({
    classId: objectIdSchema,

    subjectId: objectIdSchema,

    academicSessionId: objectIdSchema,

    title: z
      .string()
      .trim()
      .min(1, 'Assignment title is required')
      .max(
        200,
        'Assignment title cannot exceed 200 characters'
      ),

    instructions: z
      .string()
      .trim()
      .max(
        5000,
        'Instructions cannot exceed 5000 characters'
      )
      .optional(),

    dueDate: dateStringSchema,

    isPublished: z
      .boolean()
      .optional(),
  });

export const updateAssignmentSchema =
  z
    .object({
      title: z
        .string()
        .trim()
        .min(
          1,
          'Assignment title cannot be empty'
        )
        .max(
          200,
          'Assignment title cannot exceed 200 characters'
        )
        .optional(),

      instructions: z
        .string()
        .trim()
        .max(
          5000,
          'Instructions cannot exceed 5000 characters'
        )
        .optional(),

      dueDate:
        dateStringSchema.optional(),

      isPublished: z
        .boolean()
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

export type CreateAssignmentValidatedInput =
  z.infer<typeof createAssignmentSchema>;

export type UpdateAssignmentValidatedInput =
  z.infer<typeof updateAssignmentSchema>;