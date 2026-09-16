import { Types } from 'mongoose';

import {
  Student,
  StudentGender,
} from './student.model';

import {
  CreateStudentInput,
  UpdateStudentInput,
} from './student.types';

import { Parent } from '../parents/parent.model';
import { ParentStudent } from '../ParentStudent/parentstudent.model';

const convertGender = (
  gender?: 'MALE' | 'FEMALE'
): StudentGender | undefined => {
  if (!gender) {
    return undefined;
  }

  return gender === 'MALE'
    ? StudentGender.MALE
    : StudentGender.FEMALE;
};

export const createStudent = async (
  schoolId: string,
  data: CreateStudentInput
) => {
  if (!Types.ObjectId.isValid(schoolId)) {
    throw new Error('Invalid school ID');
  }

  if (
    data.classId &&
    !Types.ObjectId.isValid(data.classId)
  ) {
    throw new Error('Invalid class ID');
  }

  if (
    data.academicSessionId &&
    !Types.ObjectId.isValid(data.academicSessionId)
  ) {
    throw new Error('Invalid academic session ID');
  }

  const admissionNumber =
    data.admissionNumber.trim().toUpperCase();

  const existingStudent = await Student.findOne({
    schoolId,
    admissionNumber,
  });

  if (existingStudent) {
    throw new Error(
      'A student with this admission number already exists in this school'
    );
  }

  const student = await Student.create({
    schoolId: new Types.ObjectId(schoolId),
    admissionNumber,
    firstName: data.firstName,
    middleName: data.middleName,
    lastName: data.lastName,
    dateOfBirth: data.dateOfBirth,
    gender: convertGender(data.gender),
    classId: data.classId
      ? new Types.ObjectId(data.classId)
      : undefined,
    academicSessionId: data.academicSessionId
      ? new Types.ObjectId(data.academicSessionId)
      : undefined,
  });

  return student;
};

export const getStudents = async (
  schoolId: string
) => {
  if (!Types.ObjectId.isValid(schoolId)) {
    throw new Error('Invalid school ID');
  }

  const students = await Student.find({
    schoolId,
    isActive: true,
  }).sort({
    createdAt: -1,
  });

  return students;
};

export const getMyChildrenStudents = async (
  userId: string,
  schoolId: string
) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }

  if (!Types.ObjectId.isValid(schoolId)) {
    throw new Error('Invalid school ID');
  }

  const parent = await Parent.findOne({
    userId,
    schoolId,
    isActive: true,
  });

  if (!parent) {
    throw new Error(
      'Active parent profile not found for this user'
    );
  }

  const relationships =
    await ParentStudent.find({
      schoolId,
      parentId: parent._id,
      isActive: true,
    }).select('studentId');

  const studentIds = relationships.map(
    (relationship) => relationship.studentId
  );

  if (studentIds.length === 0) {
    return [];
  }

  const students = await Student.find({
    _id: { $in: studentIds },
    schoolId,
    isActive: true,
  })
    .select(
      'admissionNumber firstName middleName lastName dateOfBirth gender classId academicSessionId isActive'
    )
    .sort({
      createdAt: -1,
    });

  return students;
};

export const getStudentById = async (
  studentId: string,
  schoolId: string
) => {
  if (!Types.ObjectId.isValid(studentId)) {
    throw new Error('Invalid student ID');
  }

  if (!Types.ObjectId.isValid(schoolId)) {
    throw new Error('Invalid school ID');
  }

  const student = await Student.findOne({
    _id: studentId,
    schoolId,
  });

  if (!student) {
    throw new Error('Student not found');
  }

  return student;
};

export const updateStudent = async (
  studentId: string,
  schoolId: string,
  data: UpdateStudentInput
) => {
  if (!Types.ObjectId.isValid(studentId)) {
    throw new Error('Invalid student ID');
  }

  if (!Types.ObjectId.isValid(schoolId)) {
    throw new Error('Invalid school ID');
  }

  if (
    data.classId &&
    !Types.ObjectId.isValid(data.classId)
  ) {
    throw new Error('Invalid class ID');
  }

  if (
    data.academicSessionId &&
    !Types.ObjectId.isValid(data.academicSessionId)
  ) {
    throw new Error('Invalid academic session ID');
  }

  const admissionNumber = data.admissionNumber
    ? data.admissionNumber.trim().toUpperCase()
    : undefined;

  if (admissionNumber) {
    const existingStudent =
      await Student.findOne({
        schoolId,
        admissionNumber,
        _id: {
          $ne: studentId,
        },
      });

    if (existingStudent) {
      throw new Error(
        'A student with this admission number already exists in this school'
      );
    }
  }

  const updateData = {
    ...(data.firstName !== undefined && {
      firstName: data.firstName,
    }),

    ...(data.middleName !== undefined && {
      middleName: data.middleName,
    }),

    ...(data.lastName !== undefined && {
      lastName: data.lastName,
    }),

    ...(data.dateOfBirth !== undefined && {
      dateOfBirth: data.dateOfBirth,
    }),

    ...(data.gender !== undefined && {
      gender: convertGender(data.gender),
    }),

    ...(data.classId !== undefined && {
      classId: data.classId
        ? new Types.ObjectId(data.classId)
        : undefined,
    }),

    ...(data.academicSessionId !== undefined && {
      academicSessionId: data.academicSessionId
        ? new Types.ObjectId(data.academicSessionId)
        : undefined,
    }),

    ...(admissionNumber !== undefined && {
      admissionNumber,
    }),

    ...(data.isActive !== undefined && {
      isActive: data.isActive,
    }),
  };

  const student =
    await Student.findOneAndUpdate(
      {
        _id: studentId,
        schoolId,
      },
      {
        $set: updateData,
      },
      {
        new: true,
        runValidators: true,
      }
    );

  if (!student) {
    throw new Error('Student not found');
  }

  return student;
};

export const deleteStudent = async (
  studentId: string,
  schoolId: string
) => {
  if (!Types.ObjectId.isValid(studentId)) {
    throw new Error('Invalid student ID');
  }

  if (!Types.ObjectId.isValid(schoolId)) {
    throw new Error('Invalid school ID');
  }

  const student =
    await Student.findOneAndUpdate(
      {
        _id: studentId,
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

  if (!student) {
    throw new Error('Student not found');
  }

  return student;
};