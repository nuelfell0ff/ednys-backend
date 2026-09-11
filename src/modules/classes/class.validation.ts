import { z } from 'zod';

const objectIdSchema = z
  .string()
  .regex(
    /^[a-fA-F0-9]{24}$/,
    'Must be a valid ID'
  );

export const createClassSchema = z.object({
  academicSessionId: objectIdSchema,

  name: z
    .string()
    .trim()
    .min(1, 'Class name is required')
    .max(
      100,
      'Class name cannot exceed 100 characters'
    ),

  code: z
    .string()
    .trim()
    .max(
      50,
      'Class code cannot exceed 50 characters'
    )
    .optional(),

  level: z
    .string()
    .trim()
    .max(
      50,
      'Class level cannot exceed 50 characters'
    )
    .optional(),

  capacity: z
    .number()
    .int('Class capacity must be a whole number')
    .min(
      1,
      'Class capacity must be at least 1'
    )
    .optional(),
});

export const updateClassSchema = z
  .object({
    academicSessionId:
      objectIdSchema.optional(),

    name: z
      .string()
      .trim()
      .min(
        1,
        'Class name cannot be empty'
      )
      .max(
        100,
        'Class name cannot exceed 100 characters'
      )
      .optional(),

    code: z
      .string()
      .trim()
      .max(
        50,
        'Class code cannot exceed 50 characters'
      )
      .optional(),

    level: z
      .string()
      .trim()
      .max(
        50,
        'Class level cannot exceed 50 characters'
      )
      .optional(),

    capacity: z
      .number()
      .int(
        'Class capacity must be a whole number'
      )
      .min(
        1,
        'Class capacity must be at least 1'
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

export type CreateClassValidatedInput =
  z.infer<typeof createClassSchema>;

export type UpdateClassValidatedInput =
  z.infer<typeof updateClassSchema>;