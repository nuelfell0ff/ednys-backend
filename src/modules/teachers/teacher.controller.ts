import { Request, Response } from 'express';

import {
  createTeacher,
  deleteTeacher,
  getTeacherById,
  getTeachers,
  updateTeacher,
} from './teacher.service';

import {
  createTeacherSchema,
  updateTeacherSchema,
} from './teacher.validation';

const getSchoolId = (
  req: Request
): string | null => {
  if (!req.user?.schoolId) {
    return null;
  }

  return req.user.schoolId;
};

const getTeacherId = (
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

export const createTeacherController =
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

    const validationResult =
      createTeacherSchema.safeParse(
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
      const teacher =
        await createTeacher(
          schoolId,
          validationResult.data
        );

      res.status(201).json({
        success: true,
        message:
          'Teacher created successfully',
        data: teacher,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to create teacher',
      });
    }
  };

export const getTeachersController =
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

    try {
      const teachers =
        await getTeachers(schoolId);

      res.status(200).json({
        success: true,
        data: teachers,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to retrieve teachers',
      });
    }
  };

export const getTeacherController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId = getSchoolId(req);
    const teacherId = getTeacherId(req);

    if (!schoolId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });

      return;
    }

    if (!teacherId) {
      res.status(400).json({
        success: false,
        message: 'Teacher ID is required',
      });

      return;
    }

    try {
      const teacher =
        await getTeacherById(
          teacherId,
          schoolId
        );

      res.status(200).json({
        success: true,
        data: teacher,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to retrieve teacher';

      res.status(
        message === 'Teacher not found'
          ? 404
          : 400
      ).json({
        success: false,
        message,
      });
    }
  };

export const updateTeacherController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId = getSchoolId(req);
    const teacherId = getTeacherId(req);

    if (!schoolId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });

      return;
    }

    if (!teacherId) {
      res.status(400).json({
        success: false,
        message: 'Teacher ID is required',
      });

      return;
    }

    const validationResult =
      updateTeacherSchema.safeParse(
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
      const teacher =
        await updateTeacher(
          teacherId,
          schoolId,
          validationResult.data
        );

      res.status(200).json({
        success: true,
        message:
          'Teacher updated successfully',
        data: teacher,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to update teacher';

      res.status(
        message === 'Teacher not found'
          ? 404
          : 400
      ).json({
        success: false,
        message,
      });
    }
  };

export const deleteTeacherController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId = getSchoolId(req);
    const teacherId = getTeacherId(req);

    if (!schoolId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });

      return;
    }

    if (!teacherId) {
      res.status(400).json({
        success: false,
        message: 'Teacher ID is required',
      });

      return;
    }

    try {
      const teacher =
        await deleteTeacher(
          teacherId,
          schoolId
        );

      res.status(200).json({
        success: true,
        message:
          'Teacher deactivated successfully',
        data: teacher,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to deactivate teacher';

      res.status(
        message === 'Teacher not found'
          ? 404
          : 400
      ).json({
        success: false,
        message,
      });
    }
  };