import { Request, Response } from 'express';

import {
  createAttendance,
  createBulkAttendance,
  getAttendanceByClass,
  getAttendanceById,
  getStudentAttendance,
  updateAttendance,
} from './attendance.service';

import {
  bulkAttendanceSchema,
  createAttendanceSchema,
  updateAttendanceSchema,
} from './attendance.validation';

const getSchoolId = (
  req: Request
): string | null => {
  if (!req.user?.schoolId) {
    return null;
  }

  return req.user.schoolId;
};

const getUserId = (
  req: Request
): string | null => {
  if (!req.user?.userId) {
    return null;
  }

  return req.user.userId;
};

const getAttendanceId = (
  req: Request
): string | null => {
  const { id } = req.params;

  if (
    typeof id !== 'string' ||
    !id.trim()
  ) {
    return null;
  }

  return id;
};

export const createAttendanceController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId = getSchoolId(req);
    const userId = getUserId(req);

    if (!schoolId || !userId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });

      return;
    }

    const validationResult =
      createAttendanceSchema.safeParse(
        req.body
      );

    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors:
          validationResult.error.flatten(),
      });

      return;
    }

    try {
      const attendance =
        await createAttendance(
          userId,
          schoolId,
          validationResult.data
        );

      res.status(201).json({
        success: true,
        message:
          'Attendance recorded successfully',
        data: attendance,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to record attendance',
      });
    }
  };

export const createBulkAttendanceController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId = getSchoolId(req);
    const userId = getUserId(req);

    if (!schoolId || !userId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });

      return;
    }

    const validationResult =
      bulkAttendanceSchema.safeParse(
        req.body
      );

    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors:
          validationResult.error.flatten(),
      });

      return;
    }

    try {
      const attendance =
        await createBulkAttendance(
          userId,
          schoolId,
          validationResult.data
        );

      res.status(200).json({
        success: true,
        message:
          'Bulk attendance saved successfully',
        data: attendance,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to save bulk attendance',
      });
    }
  };

export const getAttendanceByClassController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId = getSchoolId(req);

    if (!schoolId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });

      return;
    }

    const {
      classId,
      academicSessionId,
      date,
    } = req.query;

    if (
      typeof classId !== 'string' ||
      !classId.trim()
    ) {
      res.status(400).json({
        success: false,
        message:
          'classId query parameter is required',
      });

      return;
    }

    if (
      typeof academicSessionId !== 'string' ||
      !academicSessionId.trim()
    ) {
      res.status(400).json({
        success: false,
        message:
          'academicSessionId query parameter is required',
      });

      return;
    }

    if (
      typeof date !== 'string' ||
      !date.trim()
    ) {
      res.status(400).json({
        success: false,
        message:
          'date query parameter is required',
      });

      return;
    }

    try {
      const attendance =
        await getAttendanceByClass(
          schoolId,
          classId,
          academicSessionId,
          date
        );

      res.status(200).json({
        success: true,
        data: attendance,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to retrieve attendance',
      });
    }
  };

export const getStudentAttendanceController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId = getSchoolId(req);

    if (!schoolId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });

      return;
    }

    const { studentId } = req.params;

    if (
      typeof studentId !== 'string' ||
      !studentId.trim()
    ) {
      res.status(400).json({
        success: false,
        message:
          'Student ID is required',
      });

      return;
    }

    try {
      const attendance =
        await getStudentAttendance(
          studentId,
          schoolId
        );

      res.status(200).json({
        success: true,
        data: attendance,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to retrieve student attendance',
      });
    }
  };

export const getAttendanceController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId = getSchoolId(req);
    const attendanceId =
      getAttendanceId(req);

    if (!schoolId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });

      return;
    }

    if (!attendanceId) {
      res.status(400).json({
        success: false,
        message:
          'Attendance ID is required',
      });

      return;
    }

    try {
      const attendance =
        await getAttendanceById(
          attendanceId,
          schoolId
        );

      res.status(200).json({
        success: true,
        data: attendance,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Attendance record not found',
      });
    }
  };

export const updateAttendanceController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId = getSchoolId(req);
    const userId = getUserId(req);
    const attendanceId =
      getAttendanceId(req);

    if (!schoolId || !userId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });

      return;
    }

    if (!attendanceId) {
      res.status(400).json({
        success: false,
        message:
          'Attendance ID is required',
      });

      return;
    }

    const validationResult =
      updateAttendanceSchema.safeParse(
        req.body
      );

    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors:
          validationResult.error.flatten(),
      });

      return;
    }

    try {
      const attendance =
        await updateAttendance(
          attendanceId,
          userId,
          schoolId,
          validationResult.data
        );

      res.status(200).json({
        success: true,
        message:
          'Attendance updated successfully',
        data: attendance,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to update attendance',
      });
    }
  };