import { Types } from 'mongoose';

import { Assignment } from './assignment.model';
import {
  CreateAssignmentInput,
  UpdateAssignmentInput,
} from './assignment.types';

import { Teacher } from '../teachers/teacher.model';
import { TeacherAssignment } from '../teacher-assignments/teacher-assignment.model';
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
  validateObjectId(
    schoolId,
    'Invalid school ID'
  );
};

const getTeacherProfile = async (
  userId: string,
  schoolId: string
) => {
  validateObjectId(
    userId,
    'Invalid user ID'
  );

  validateSchoolId(schoolId);

  const teacher = await Teacher.findOne({
    userId,
    schoolId,
    isActive: true,
  });

  if (!teacher) {
    throw new Error(
      'Active teacher profile not found'
    );
  }

  return teacher;
};

export const createAssignment = async (
  userId: string,
  schoolId: string,
  data: CreateAssignmentInput
) => {
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

  const teacher = await getTeacherProfile(
    userId,
    schoolId
  );

  const teacherAssignment =
    await TeacherAssignment.findOne({
      schoolId,
      teacherId: teacher._id,
      classId: data.classId,
      subjectId: data.subjectId,
      academicSessionId:
        data.academicSessionId,
      isActive: true,
    });

  if (!teacherAssignment) {
    throw new Error(
      'You are not assigned to teach this subject for this class and academic session'
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

  const assignment =
    await Assignment.create({
      schoolId: new Types.ObjectId(
        schoolId
      ),
      teacherId: teacher._id,
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
      title: data.title.trim(),
      instructions:
        data.instructions?.trim(),
      dueDate: new Date(data.dueDate),
      isPublished:
        data.isPublished ?? false,
    });

  return assignment;
};

export const getAssignments = async (
  schoolId: string
) => {
  validateSchoolId(schoolId);

  const assignments =
    await Assignment.find({
      schoolId,
      isActive: true,
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
      })
      .sort({
        dueDate: 1,
        createdAt: -1,
      });

  return assignments;
};

export const getTeacherAssignmentsForUser =
  async (
    userId: string,
    schoolId: string
  ) => {
    const teacher =
      await getTeacherProfile(
        userId,
        schoolId
      );

    const assignments =
      await Assignment.find({
        schoolId,
        teacherId: teacher._id,
        isActive: true,
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
        })
        .sort({
          dueDate: 1,
          createdAt: -1,
        });

    return assignments;
  };

export const getAssignmentById =
  async (
    assignmentId: string,
    schoolId: string
  ) => {
    validateObjectId(
      assignmentId,
      'Invalid assignment ID'
    );

    validateSchoolId(schoolId);

    const assignment =
      await Assignment.findOne({
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
        'Assignment not found'
      );
    }

    return assignment;
  };

export const updateAssignment = async (
  assignmentId: string,
  userId: string,
  schoolId: string,
  data: UpdateAssignmentInput
) => {
  validateObjectId(
    assignmentId,
    'Invalid assignment ID'
  );

  validateSchoolId(schoolId);

  const teacher =
    await getTeacherProfile(
      userId,
      schoolId
    );

  const assignment =
    await Assignment.findOne({
      _id: assignmentId,
      schoolId,
      teacherId: teacher._id,
    });

  if (!assignment) {
    throw new Error(
      'Assignment not found or you do not have permission to update it'
    );
  }

  const updateData: {
    title?: string;
    instructions?: string;
    dueDate?: Date;
    isPublished?: boolean;
    isActive?: boolean;
  } = {};

  if (data.title !== undefined) {
    updateData.title =
      data.title.trim();
  }

  if (
    data.instructions !== undefined
  ) {
    updateData.instructions =
      data.instructions.trim();
  }

  if (data.dueDate !== undefined) {
    updateData.dueDate =
      new Date(data.dueDate);
  }

  if (
    data.isPublished !== undefined
  ) {
    updateData.isPublished =
      data.isPublished;
  }

  if (data.isActive !== undefined) {
    updateData.isActive =
      data.isActive;
  }

  const updatedAssignment =
    await Assignment.findOneAndUpdate(
      {
        _id: assignmentId,
        schoolId,
        teacherId: teacher._id,
      },
      {
        $set: updateData,
      },
      {
        new: true,
        runValidators: true,
      }
    );

  if (!updatedAssignment) {
    throw new Error(
      'Assignment not found or you do not have permission to update it'
    );
  }

  return updatedAssignment;
};

export const deleteAssignment = async (
  assignmentId: string,
  userId: string,
  schoolId: string
) => {
  validateObjectId(
    assignmentId,
    'Invalid assignment ID'
  );

  validateSchoolId(schoolId);

  const teacher =
    await getTeacherProfile(
      userId,
      schoolId
    );

  const assignment =
    await Assignment.findOneAndUpdate(
      {
        _id: assignmentId,
        schoolId,
        teacherId: teacher._id,
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
      'Assignment not found or you do not have permission to delete it'
    );
  }

  return assignment;
};