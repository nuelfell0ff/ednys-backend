import { Request, Response } from 'express';

import {
  createParentStudent,
  deleteParentStudent,
  getParentStudentById,
  getParentStudents,
  getStudentsForAuthenticatedParent,
  updateParentStudent,
} from './parentstudent.service';

import {
  createParentStudentSchema,
  updateParentStudentSchema,
} from './parentstudent.validation';

const getSchoolId = (
  req: Request
): string | undefined => {
  return req.user?.schoolId;
};

const getUserId = (
  req: Request
): string | undefined => {
  return req.user?.userId;
};

const getRelationshipId = (
  req: Request
): string | undefined => {
  const { id } = req.params;

  if (
    typeof id !== 'string' ||
    !id.trim()
  ) {
    return undefined;
  }

  return id;
};

export const createParentStudentController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId = getSchoolId(req);

    if (!schoolId) {
      res.status(401).json({
        success: false,
        message:
          'Authentication required',
      });

      return;
    }

    const validationResult =
      createParentStudentSchema.safeParse(
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
      const relationship =
        await createParentStudent(
          schoolId,
          validationResult.data
        );

      res.status(201).json({
        success: true,
        message:
          'Parent-student relationship created successfully',
        data: relationship,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to create parent-student relationship',
      });
    }
  };

export const getParentStudentsController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId = getSchoolId(req);

    if (!schoolId) {
      res.status(401).json({
        success: false,
        message:
          'Authentication required',
      });

      return;
    }

    try {
      const relationships =
        await getParentStudents(
          schoolId
        );

      res.status(200).json({
        success: true,
        data: relationships,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to retrieve parent-student relationships',
      });
    }
  };

export const getParentStudentController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId = getSchoolId(req);
    const relationshipId =
      getRelationshipId(req);

    if (!schoolId) {
      res.status(401).json({
        success: false,
        message:
          'Authentication required',
      });

      return;
    }

    if (!relationshipId) {
      res.status(400).json({
        success: false,
        message:
          'Relationship ID is required',
      });

      return;
    }

    try {
      const relationship =
        await getParentStudentById(
          schoolId,
          relationshipId
        );

      res.status(200).json({
        success: true,
        data: relationship,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Parent-student relationship not found',
      });
    }
  };

export const getMyStudentsController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId = getSchoolId(req);
    const userId = getUserId(req);

    if (!schoolId) {
      res.status(401).json({
        success: false,
        message:
          'Authentication required',
      });

      return;
    }

    if (!userId) {
      res.status(401).json({
        success: false,
        message:
          'Authenticated user not found',
      });

      return;
    }

    try {
      const relationships =
        await getStudentsForAuthenticatedParent(
          schoolId,
          userId
        );

      res.status(200).json({
        success: true,
        data: relationships,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to retrieve students for parent',
      });
    }
  };

export const updateParentStudentController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId = getSchoolId(req);
    const relationshipId =
      getRelationshipId(req);

    if (!schoolId) {
      res.status(401).json({
        success: false,
        message:
          'Authentication required',
      });

      return;
    }

    if (!relationshipId) {
      res.status(400).json({
        success: false,
        message:
          'Relationship ID is required',
      });

      return;
    }

    const validationResult =
      updateParentStudentSchema.safeParse(
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
      const relationship =
        await updateParentStudent(
          schoolId,
          relationshipId,
          validationResult.data
        );

      res.status(200).json({
        success: true,
        message:
          'Parent-student relationship updated successfully',
        data: relationship,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to update parent-student relationship',
      });
    }
  };

export const deleteParentStudentController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId = getSchoolId(req);
    const relationshipId =
      getRelationshipId(req);

    if (!schoolId) {
      res.status(401).json({
        success: false,
        message:
          'Authentication required',
      });

      return;
    }

    if (!relationshipId) {
      res.status(400).json({
        success: false,
        message:
          'Relationship ID is required',
      });

      return;
    }

    try {
      const relationship =
        await deleteParentStudent(
          schoolId,
          relationshipId
        );

      res.status(200).json({
        success: true,
        message:
          'Parent-student relationship deactivated successfully',
        data: relationship,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Parent-student relationship not found',
      });
    }
  };