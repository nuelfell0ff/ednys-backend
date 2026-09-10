import { Request, Response } from 'express';
import {
  createSchool,
  getSchoolById,
  updateSchool,
} from './school.service';

const getSchoolId = (req: Request): string | null => {
  const { id } = req.params;

  if (typeof id !== 'string' || !id.trim()) {
    return null;
  }

  return id;
};

export const createSchoolController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const school = await createSchool(req.body);

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

export const getSchoolController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const schoolId = getSchoolId(req);

  if (!schoolId) {
    res.status(400).json({
      success: false,
      message: 'School ID is required',
    });

    return;
  }

  try {
    const school = await getSchoolById(schoolId);

    res.status(200).json({
      success: true,
      data: school,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'School not found',
    });
  }
};

export const updateSchoolController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const schoolId = getSchoolId(req);

  if (!schoolId) {
    res.status(400).json({
      success: false,
      message: 'School ID is required',
    });

    return;
  }

  try {
    const school = await updateSchool(
      schoolId,
      req.body
    );

    res.status(200).json({
      success: true,
      data: school,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Failed to update school',
    });
  }
};
