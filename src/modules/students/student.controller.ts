import { Request, Response } from 'express';

import {
  createStudent,
  deleteStudent,
  getStudentById,
  getStudents,
  updateStudent,
} from './student.service';

import {
  createStudentSchema,
  updateStudentSchema,
} from './student.validation';

const getSchoolId = (
  req: Request
): string | null => {
  if (!req.user?.schoolId) {
    return null;
  }

  return req.user.schoolId;
};

const getStudentId = (
  req: Request
): string | null => {
  const { id } = req.params;

  if (typeof id !== 'string' || !id.trim()) {
    return null;
  }

  return id;
};

export const createStudentController = async (
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
    createStudentSchema.safeParse(req.body);

  if (!validationResult.success) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: validationResult.error.flatten(),
    });

    return;
  }

  try {
    const student = await createStudent(
      schoolId,
      validationResult.data
    );

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: student,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Failed to create student',
    });
  }
};

export const getStudentsController = async (
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
    const students = await getStudents(schoolId);

    res.status(200).json({
      success: true,
      data: students,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Failed to retrieve students',
    });
  }
};

export const getStudentController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const schoolId = getSchoolId(req);
  const studentId = getStudentId(req);

  if (!schoolId) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
    });

    return;
  }

  if (!studentId) {
    res.status(400).json({
      success: false,
      message: 'Student ID is required',
    });

    return;
  }

  try {
    const student = await getStudentById(
      studentId,
      schoolId
    );

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Student not found',
    });
  }
};

export const updateStudentController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const schoolId = getSchoolId(req);
  const studentId = getStudentId(req);

  if (!schoolId) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
    });

    return;
  }

  if (!studentId) {
    res.status(400).json({
      success: false,
      message: 'Student ID is required',
    });

    return;
  }

  const validationResult =
    updateStudentSchema.safeParse(req.body);

  if (!validationResult.success) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: validationResult.error.flatten(),
    });

    return;
  }

  try {
    const student = await updateStudent(
      studentId,
      schoolId,
      validationResult.data
    );

    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: student,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Failed to update student',
    });
  }
};

export const deleteStudentController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const schoolId = getSchoolId(req);
  const studentId = getStudentId(req);

  if (!schoolId) {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
    });

    return;
  }

  if (!studentId) {
    res.status(400).json({
      success: false,
      message: 'Student ID is required',
    });

    return;
  }

  try {
    const student = await deleteStudent(
      studentId,
      schoolId
    );

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully',
      data: student,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Student not found',
    });
  }
};