import { z } from 'zod';

export const createSubjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Subject name is required')
    .max(
      100,
      'Subject name cannot exceed 100 characters'
    ),

  code: z
    .string()
    .trim()
    .max(
      50,
      'Subject code cannot exceed 50 characters'
    )
    .optional(),

  description: z
    .string()
    .trim()
    .max(
      500,
      'Subject description cannot exceed 500 characters'
    )
    .optional(),
});

export const updateSubjectSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(
        1,
        'Subject name cannot be empty'
      )
      .max(
        100,
        'Subject name cannot exceed 100 characters'
      )
      .optional(),

    code: z
      .string()
      .trim()
      .max(
        50,
        'Subject code cannot exceed 50 characters'
      )
      .optional(),

    description: z
      .string()
      .trim()
      .max(
        500,
        'Subject description cannot exceed 500 characters'
      )
      .optional(),

    isActive: z
      .boolean()
      .optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message:
        'At least one field is required for an update',
    }
  );

export type CreateSubjectValidatedInput =
  z.infer<typeof createSubjectSchema>;

export type UpdateSubjectValidatedInput =
  z.infer<typeof updateSubjectSchema>;