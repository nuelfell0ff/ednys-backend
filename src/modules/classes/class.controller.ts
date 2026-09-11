import { Request, Response } from 'express';

import {
  createClass,
  deleteClass,
  getClassById,
  getClasses,
  updateClass,
} from './class.service';

import {
  createClassSchema,
  updateClassSchema,
} from './class.validation';

const getSchoolId = (
  req: Request
): string | null => {
  if (!req.user?.schoolId) {
    return null;
  }

  return req.user.schoolId;
};

const getClassId = (
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

export const createClassController = async (
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
    createClassSchema.safeParse(req.body);

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
    const classRecord = await createClass(
      schoolId,
      validationResult.data
    );

    res.status(201).json({
      success: true,
      message: 'Class created successfully',
      data: classRecord,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Failed to create class',
    });
  }
};

export const getClassesController = async (
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

  const academicSessionId =
    typeof req.query.academicSessionId ===
    'string'
      ? req.query.academicSessionId
      : undefined;

  try {
    const classes = await getClasses(
      schoolId,
      academicSessionId
    );

    res.status(200).json({
      success: true,
      data: classes,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Failed to retrieve classes',
    });
  }
};

export const getClassController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const schoolId = getSchoolId(req);
  const classId = getClassId(req);

  if (!schoolId) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
    });

    return;
  }

  if (!classId) {
    res.status(400).json({
      success: false,
      message: 'Class ID is required',
    });

    return;
  }

  try {
    const classRecord = await getClassById(
      classId,
      schoolId
    );

    res.status(200).json({
      success: true,
      data: classRecord,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Class not found',
    });
  }
};

export const updateClassController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const schoolId = getSchoolId(req);
  const classId = getClassId(req);

  if (!schoolId) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
    });

    return;
  }

  if (!classId) {
    res.status(400).json({
      success: false,
      message: 'Class ID is required',
    });

    return;
  }

  const validationResult =
    updateClassSchema.safeParse(req.body);

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
    const classRecord = await updateClass(
      classId,
      schoolId,
      validationResult.data
    );

    res.status(200).json({
      success: true,
      message: 'Class updated successfully',
      data: classRecord,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Failed to update class',
    });
  }
};

export const deleteClassController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const schoolId = getSchoolId(req);
  const classId = getClassId(req);

  if (!schoolId) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
    });

    return;
  }

  if (!classId) {
    res.status(400).json({
      success: false,
      message: 'Class ID is required',
    });

    return;
  }

  try {
    const classRecord = await deleteClass(
      classId,
      schoolId
    );

    res.status(200).json({
      success: true,
      message: 'Class deleted successfully',
      data: classRecord,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Class not found',
    });
  }
};