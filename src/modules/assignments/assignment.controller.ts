import { Request, Response } from 'express';

import {
  createAssignment,
  deleteAssignment,
  getAssignmentById,
  getAssignments,
  getTeacherAssignmentsForUser,
  updateAssignment,
} from './assignment.service';

import {
  createAssignmentSchema,
  updateAssignmentSchema,
} from './assignment.validation';

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

export const createAssignmentController =
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
      createAssignmentSchema.safeParse(
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
        await createAssignment(
          userId,
          schoolId,
          validationResult.data
        );

      res.status(201).json({
        success: true,
        message:
          'Assignment created successfully',
        data: assignment,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to create assignment',
      });
    }
  };

export const getAssignmentsController =
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
        await getAssignments(
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
            : 'Failed to retrieve assignments',
      });
    }
  };

export const getMyAssignmentsController =
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

    try {
      const assignments =
        await getTeacherAssignmentsForUser(
          userId,
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
            : 'Failed to retrieve your assignments',
      });
    }
  };

export const getAssignmentController =
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
        message: 'Assignment ID is required',
      });

      return;
    }

    try {
      const assignment =
        await getAssignmentById(
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
            : 'Assignment not found',
      });
    }
  };

export const updateAssignmentController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId = getSchoolId(req);
    const userId = getUserId(req);
    const assignmentId =
      getAssignmentId(req);

    if (!schoolId || !userId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });

      return;
    }

    if (!assignmentId) {
      res.status(400).json({
        success: false,
        message: 'Assignment ID is required',
      });

      return;
    }

    const validationResult =
      updateAssignmentSchema.safeParse(
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
        await updateAssignment(
          assignmentId,
          userId,
          schoolId,
          validationResult.data
        );

      res.status(200).json({
        success: true,
        message:
          'Assignment updated successfully',
        data: assignment,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to update assignment',
      });
    }
  };

export const deleteAssignmentController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId = getSchoolId(req);
    const userId = getUserId(req);
    const assignmentId =
      getAssignmentId(req);

    if (!schoolId || !userId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });

      return;
    }

    if (!assignmentId) {
      res.status(400).json({
        success: false,
        message: 'Assignment ID is required',
      });

      return;
    }

    try {
      const assignment =
        await deleteAssignment(
          assignmentId,
          userId,
          schoolId
        );

      res.status(200).json({
        success: true,
        message:
          'Assignment deleted successfully',
        data: assignment,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Assignment not found',
      });
    }
  };