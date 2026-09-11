import { z } from 'zod';

export const createAcademicSessionSchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(1, 'Academic session name is required')
      .max(
        50,
        'Academic session name cannot exceed 50 characters'
      ),

    startDate: z
      .string()
      .datetime({
        message: 'Start date must be a valid date',
      }),

    endDate: z
      .string()
      .datetime({
        message: 'End date must be a valid date',
      }),

    isActive: z
      .boolean()
      .optional(),
  });

export const updateAcademicSessionSchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(
        1,
        'Academic session name cannot be empty'
      )
      .max(
        50,
        'Academic session name cannot exceed 50 characters'
      )
      .optional(),

    startDate: z
      .string()
      .datetime({
        message: 'Start date must be a valid date',
      })
      .optional(),

    endDate: z
      .string()
      .datetime({
        message: 'End date must be a valid date',
      })
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

export type CreateAcademicSessionValidatedInput =
  z.infer<typeof createAcademicSessionSchema>;

export type UpdateAcademicSessionValidatedInput =
  z.infer<typeof updateAcademicSessionSchema>;