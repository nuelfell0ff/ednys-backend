import { Request, Response } from 'express';

import {
  createAcademicSession,
  deleteAcademicSession,
  getAcademicSessionById,
  getAcademicSessions,
  getActiveAcademicSession,
  updateAcademicSession,
} from './academic-session.service';

import {
  createAcademicSessionSchema,
  updateAcademicSessionSchema,
} from './academic-session.validation';

const getSchoolId = (
  req: Request
): string | null => {
  if (!req.user?.schoolId) {
    return null;
  }

  return req.user.schoolId;
};

const getSessionId = (
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

export const createAcademicSessionController =
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
      createAcademicSessionSchema.safeParse(
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
      const session =
        await createAcademicSession(
          schoolId,
          validationResult.data
        );

      res.status(201).json({
        success: true,
        message:
          'Academic session created successfully',
        data: session,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to create academic session',
      });
    }
  };

export const getAcademicSessionsController =
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
      const sessions =
        await getAcademicSessions(schoolId);

      res.status(200).json({
        success: true,
        data: sessions,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to retrieve academic sessions',
      });
    }
  };

export const getActiveAcademicSessionController =
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
      const session =
        await getActiveAcademicSession(
          schoolId
        );

      res.status(200).json({
        success: true,
        data: session,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to retrieve active academic session',
      });
    }
  };

export const getAcademicSessionController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId = getSchoolId(req);
    const sessionId = getSessionId(req);

    if (!schoolId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });

      return;
    }

    if (!sessionId) {
      res.status(400).json({
        success: false,
        message:
          'Academic session ID is required',
      });

      return;
    }

    try {
      const session =
        await getAcademicSessionById(
          sessionId,
          schoolId
        );

      res.status(200).json({
        success: true,
        data: session,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Academic session not found',
      });
    }
  };

export const updateAcademicSessionController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId = getSchoolId(req);
    const sessionId = getSessionId(req);

    if (!schoolId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });

      return;
    }

    if (!sessionId) {
      res.status(400).json({
        success: false,
        message:
          'Academic session ID is required',
      });

      return;
    }

    const validationResult =
      updateAcademicSessionSchema.safeParse(
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
      const session =
        await updateAcademicSession(
          sessionId,
          schoolId,
          validationResult.data
        );

      res.status(200).json({
        success: true,
        message:
          'Academic session updated successfully',
        data: session,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to update academic session',
      });
    }
  };

export const deleteAcademicSessionController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId = getSchoolId(req);
    const sessionId = getSessionId(req);

    if (!schoolId) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });

      return;
    }

    if (!sessionId) {
      res.status(400).json({
        success: false,
        message:
          'Academic session ID is required',
      });

      return;
    }

    try {
      const session =
        await deleteAcademicSession(
          sessionId,
          schoolId
        );

      res.status(200).json({
        success: true,
        message:
          'Academic session deleted successfully',
        data: session,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Academic session not found',
      });
    }
  };