import { Types } from 'mongoose';

import { TeacherAssignment } from './teacher-assignment.model';
import {
  CreateTeacherAssignmentInput,
  UpdateTeacherAssignmentInput,
} from './teacher-assignment.types';

import { Teacher } from '../teachers/teacher.model';
import { Class } from '../classes/class.model';
import { Subject } from '../subjects/subject.model';
import { AcademicSession } from '../academic-sessions/academic-session.model';

const validateObjectId = (
  value: string,
  message: string
): void => {
  if (!Types.ObjectId.isValid(value)) {
    throw new Error(message);
  }
};

const validateSchoolId = (
  schoolId: string
): void => {
  validateObjectId(schoolId, 'Invalid school ID');
};

export const createTeacherAssignment = async (
  schoolId: string,
  data: CreateTeacherAssignmentInput
) => {
  validateSchoolId(schoolId);

  validateObjectId(
    data.teacherId,
    'Invalid teacher ID'
  );

  validateObjectId(
    data.classId,
    'Invalid class ID'
  );

  validateObjectId(
    data.subjectId,
    'Invalid subject ID'
  );

  validateObjectId(
    data.academicSessionId,
    'Invalid academic session ID'
  );

  const teacher = await Teacher.findOne({
    _id: data.teacherId,
    schoolId,
    isActive: true,
  });

  if (!teacher) {
    throw new Error(
      'Teacher not found or is inactive'
    );
  }

  const classRecord = await Class.findOne({
    _id: data.classId,
    schoolId,
    academicSessionId:
      data.academicSessionId,
    isActive: true,
  });

  if (!classRecord) {
    throw new Error(
      'Class not found, inactive, or does not belong to this academic session'
    );
  }

  const subject = await Subject.findOne({
    _id: data.subjectId,
    schoolId,
    isActive: true,
  });

  if (!subject) {
    throw new Error(
      'Subject not found or is inactive'
    );
  }

  const academicSession =
    await AcademicSession.findOne({
      _id: data.academicSessionId,
      schoolId,
    });

  if (!academicSession) {
    throw new Error(
      'Academic session not found'
    );
  }

  const existingAssignment =
    await TeacherAssignment.findOne({
      schoolId,
      teacherId: data.teacherId,
      classId: data.classId,
      subjectId: data.subjectId,
      academicSessionId:
        data.academicSessionId,
    });

  if (existingAssignment) {
    throw new Error(
      'This teacher assignment already exists'
    );
  }

  const assignment =
    await TeacherAssignment.create({
      schoolId: new Types.ObjectId(schoolId),
      teacherId: new Types.ObjectId(
        data.teacherId
      ),
      classId: new Types.ObjectId(
        data.classId
      ),
      subjectId: new Types.ObjectId(
        data.subjectId
      ),
      academicSessionId:
        new Types.ObjectId(
          data.academicSessionId
        ),
    });

  return assignment;
};

export const getTeacherAssignments = async (
  schoolId: string
) => {
  validateSchoolId(schoolId);

  const assignments =
    await TeacherAssignment.find({
      schoolId,
      isActive: true,
    })
      .populate({
        path: 'teacherId',
        populate: {
          path: 'userId',
          select: 'name email role isActive',
        },
      })
      .populate({
        path: 'classId',
        select:
          'name code level capacity academicSessionId isActive',
      })
      .populate({
        path: 'subjectId',
        select:
          'name code description isActive',
      })
      .populate({
        path: 'academicSessionId',
        select:
          'name startDate endDate isActive',
      })
      .sort({
        createdAt: -1,
      });

  return assignments;
};

export const getTeacherAssignmentById =
  async (
    assignmentId: string,
    schoolId: string
  ) => {
    validateObjectId(
      assignmentId,
      'Invalid teacher assignment ID'
    );

    validateSchoolId(schoolId);

    const assignment =
      await TeacherAssignment.findOne({
        _id: assignmentId,
        schoolId,
      })
        .populate({
          path: 'teacherId',
          populate: {
            path: 'userId',
            select:
              'name email role isActive',
          },
        })
        .populate({
          path: 'classId',
          select:
            'name code level capacity academicSessionId isActive',
        })
        .populate({
          path: 'subjectId',
          select:
            'name code description isActive',
        })
        .populate({
          path: 'academicSessionId',
          select:
            'name startDate endDate isActive',
        });

    if (!assignment) {
      throw new Error(
        'Teacher assignment not found'
      );
    }

    return assignment;
  };

export const updateTeacherAssignment =
  async (
    assignmentId: string,
    schoolId: string,
    data: UpdateTeacherAssignmentInput
  ) => {
    validateObjectId(
      assignmentId,
      'Invalid teacher assignment ID'
    );

    validateSchoolId(schoolId);

    const assignment =
      await TeacherAssignment.findOneAndUpdate(
        {
          _id: assignmentId,
          schoolId,
        },
        {
          $set: {
            isActive: data.isActive,
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!assignment) {
      throw new Error(
        'Teacher assignment not found'
      );
    }

    return assignment;
  };

export const deleteTeacherAssignment =
  async (
    assignmentId: string,
    schoolId: string
  ) => {
    validateObjectId(
      assignmentId,
      'Invalid teacher assignment ID'
    );

    validateSchoolId(schoolId);

    const assignment =
      await TeacherAssignment.findOneAndUpdate(
        {
          _id: assignmentId,
          schoolId,
        },
        {
          $set: {
            isActive: false,
          },
        },
        {
          new: true,
        }
      );

    if (!assignment) {
      throw new Error(
        'Teacher assignment not found'
      );
    }

    return assignment;
  };