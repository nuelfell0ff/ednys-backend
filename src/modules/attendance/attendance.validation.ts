import { z } from 'zod';

import { AttendanceStatus } from './attendance.model';

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

export const createAttendanceSchema =
  z.object({
    studentId: objectIdSchema,

    classId: objectIdSchema,

    academicSessionId: objectIdSchema,

    date: dateStringSchema,

    status: z.enum(
      Object.values(AttendanceStatus) as [
        AttendanceStatus,
        ...AttendanceStatus[],
      ]
    ),

    remarks: z
      .string()
      .trim()
      .max(
        500,
        'Remarks cannot exceed 500 characters'
      )
      .optional(),
  });

export const updateAttendanceSchema =
  z
    .object({
      status: z
        .enum(
          Object.values(
            AttendanceStatus
          ) as [
            AttendanceStatus,
            ...AttendanceStatus[],
          ]
        )
        .optional(),

      remarks: z
        .string()
        .trim()
        .max(
          500,
          'Remarks cannot exceed 500 characters'
        )
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

export const bulkAttendanceRecordSchema =
  z.object({
    studentId: objectIdSchema,
    status: z.enum(
      Object.values(AttendanceStatus) as [
        AttendanceStatus,
        ...AttendanceStatus[],
      ]
    ),
    remarks: z
      .string()
      .trim()
      .max(
        500,
        'Remarks cannot exceed 500 characters'
      )
      .optional(),
  });

export const bulkAttendanceSchema =
  z.object({
    classId: objectIdSchema,
    academicSessionId: objectIdSchema,
    date: dateStringSchema,
    records: z
      .array(bulkAttendanceRecordSchema)
      .min(
        1,
        'At least one attendance record is required'
      ),
  });


export type CreateAttendanceValidatedInput =
  z.infer<typeof createAttendanceSchema>;

export type UpdateAttendanceValidatedInput =
  z.infer<typeof updateAttendanceSchema>;
  
export type BulkAttendanceValidatedInput =
  z.infer<typeof bulkAttendanceSchema>;