import { Request, Response } from 'express';

import {
  createTeacherAssignment,
  deleteTeacherAssignment,
  getTeacherAssignmentById,
  getTeacherAssignments,
  updateTeacherAssignment,
} from './teacher-assignment.service';

import {
  createTeacherAssignmentSchema,
  updateTeacherAssignmentSchema,
} from './teacher-assignment.validation';

const getSchoolId = (
  req: Request
): string | null => {
  if (!req.user?.schoolId) {
    return null;
  }

  return req.user.schoolId;
};

const getAssignmentId = (
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

export const createTeacherAssignmentController =
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
      createTeacherAssignmentSchema.safeParse(
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
      const assignment =
        await createTeacherAssignment(
          schoolId,
          validationResult.data
        );

      res.status(201).json({
        success: true,
        message:
          'Teacher assignment created successfully',
        data: assignment,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to create teacher assignment',
      });
    }
  };

export const getTeacherAssignmentsController =
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
      const assignments =
        await getTeacherAssignments(
          schoolId
        );

      res.status(200).json({
        success: true,
        data: assignments,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to retrieve teacher assignments',
      });
    }
  };

export const getTeacherAssignmentController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId = getSchoolId(req);
    const assignmentId =
      getAssignmentId(req);

    if (!schoolId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });

      return;
    }

    if (!assignmentId) {
      res.status(400).json({
        success: false,
        message:
          'Teacher assignment ID is required',
      });

      return;
    }

    try {
      const assignment =
        await getTeacherAssignmentById(
          assignmentId,
          schoolId
        );

      res.status(200).json({
        success: true,
        data: assignment,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Teacher assignment not found',
      });
    }
  };

export const updateTeacherAssignmentController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId = getSchoolId(req);
    const assignmentId =
      getAssignmentId(req);

    if (!schoolId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });

      return;
    }

    if (!assignmentId) {
      res.status(400).json({
        success: false,
        message:
          'Teacher assignment ID is required',
      });

      return;
    }

    const validationResult =
      updateTeacherAssignmentSchema.safeParse(
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
      const assignment =
        await updateTeacherAssignment(
          assignmentId,
          schoolId,
          validationResult.data
        );

      res.status(200).json({
        success: true,
        message:
          'Teacher assignment updated successfully',
        data: assignment,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to update teacher assignment',
      });
    }
  };

export const deleteTeacherAssignmentController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId = getSchoolId(req);
    const assignmentId =
      getAssignmentId(req);

    if (!schoolId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });

      return;
    }

    if (!assignmentId) {
      res.status(400).json({
        success: false,
        message:
          'Teacher assignment ID is required',
      });

      return;
    }

    try {
      const assignment =
        await deleteTeacherAssignment(
          assignmentId,
          schoolId
        );

      res.status(200).json({
        success: true,
        message:
          'Teacher assignment deleted successfully',
        data: assignment,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Teacher assignment not found',
      });
    }
  };