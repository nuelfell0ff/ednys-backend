import { z } from 'zod';

const objectIdSchema = z
  .string()
  .regex(
    /^[a-fA-F0-9]{24}$/,
    'Must be a valid ID'
  );

export const createTeacherAssignmentSchema =
  z.object({
    teacherId: objectIdSchema,

    classId: objectIdSchema,

    subjectId: objectIdSchema,

    academicSessionId: objectIdSchema,
  });

export const updateTeacherAssignmentSchema =
  z
    .object({
      isActive: z.boolean().optional(),
    })
    .refine(
      (data) => Object.keys(data).length > 0,
      {
        message:
          'At least one field is required for an update',
      }
    );

export type CreateTeacherAssignmentValidatedInput =
  z.infer<
    typeof createTeacherAssignmentSchema
  >;

export type UpdateTeacherAssignmentValidatedInput =
  z.infer<
    typeof updateTeacherAssignmentSchema
  >;