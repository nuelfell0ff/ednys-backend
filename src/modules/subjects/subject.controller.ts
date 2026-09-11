import { Request, Response } from 'express';

import {
  createSubject,
  deleteSubject,
  getSubjectById,
  getSubjects,
  updateSubject,
} from './subject.service';

import {
  createSubjectSchema,
  updateSubjectSchema,
} from './subject.validation';

const getSchoolId = (
  req: Request
): string | null => {
  if (!req.user?.schoolId) {
    return null;
  }

  return req.user.schoolId;
};

const getSubjectId = (
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

export const createSubjectController =
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
      createSubjectSchema.safeParse(
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
      const subject = await createSubject(
        schoolId,
        validationResult.data
      );

      res.status(201).json({
        success: true,
        message:
          'Subject created successfully',
        data: subject,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to create subject',
      });
    }
  };

export const getSubjectsController =
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
      const subjects =
        await getSubjects(schoolId);

      res.status(200).json({
        success: true,
        data: subjects,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to retrieve subjects',
      });
    }
  };

export const getSubjectController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId = getSchoolId(req);
    const subjectId = getSubjectId(req);

    if (!schoolId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });

      return;
    }

    if (!subjectId) {
      res.status(400).json({
        success: false,
        message: 'Subject ID is required',
      });

      return;
    }

    try {
      const subject =
        await getSubjectById(
          subjectId,
          schoolId
        );

      res.status(200).json({
        success: true,
        data: subject,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Subject not found',
      });
    }
  };

export const updateSubjectController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId = getSchoolId(req);
    const subjectId = getSubjectId(req);

    if (!schoolId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });

      return;
    }

    if (!subjectId) {
      res.status(400).json({
        success: false,
        message: 'Subject ID is required',
      });

      return;
    }

    const validationResult =
      updateSubjectSchema.safeParse(
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
      const subject =
        await updateSubject(
          subjectId,
          schoolId,
          validationResult.data
        );

      res.status(200).json({
        success: true,
        message:
          'Subject updated successfully',
        data: subject,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to update subject',
      });
    }
  };

export const deleteSubjectController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId = getSchoolId(req);
    const subjectId = getSubjectId(req);

    if (!schoolId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });

      return;
    }

    if (!subjectId) {
      res.status(400).json({
        success: false,
        message: 'Subject ID is required',
      });

      return;
    }

    try {
      const subject =
        await deleteSubject(
          subjectId,
          schoolId
        );

      res.status(200).json({
        success: true,
        message:
          'Subject deleted successfully',
        data: subject,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Subject not found',
      });
    }
  };