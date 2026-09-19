import { Request, Response } from 'express';

import {
  createSchool,
  getSchoolById,
  updateSchool,
} from './school.service';

const getSchoolId = (
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

export const createSchoolController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const school =
        await createSchool(req.body);

      res.status(201).json({
        success: true,
        data: school,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to create school',
      });
    }
  };

export const getSchoolController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId =
      getSchoolId(req);

    if (!schoolId) {
      res.status(400).json({
        success: false,
        message:
          'School ID is required',
      });

      return;
    }

    if (!req.user) {
      res.status(401).json({
        success: false,
        message:
          'Authentication required',
      });

      return;
    }

    try {
      const school =
        await getSchoolById(
          schoolId,
          req.user.userId,
          req.user.role,
          req.user.schoolId
        );

      res.status(200).json({
        success: true,
        data: school,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to retrieve school';

      const status =
        message.includes(
          'permission'
        )
          ? 403
          : message ===
              'School not found'
            ? 404
            : 400;

      res.status(status).json({
        success: false,
        message,
      });
    }
  };

export const updateSchoolController =
  async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const schoolId =
      getSchoolId(req);

    if (!schoolId) {
      res.status(400).json({
        success: false,
        message:
          'School ID is required',
      });

      return;
    }

    if (!req.user) {
      res.status(401).json({
        success: false,
        message:
          'Authentication required',
      });

      return;
    }

    try {
      const school =
        await updateSchool(
          schoolId,
          req.body,
          req.user.userId,
          req.user.role,
          req.user.schoolId
        );

      res.status(200).json({
        success: true,
        data: school,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to update school';

      const status =
        message.includes(
          'permission'
        )
          ? 403
          : message ===
              'School not found'
            ? 404
            : 400;

      res.status(status).json({
        success: false,
        message,
      });
    }
  };