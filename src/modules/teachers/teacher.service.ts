import { Types } from 'mongoose';

import { Teacher } from './teacher.model';
import {
  CreateTeacherInput,
  UpdateTeacherInput,
} from './teacher.types';

import { User, UserRole } from '../users/user.model';

const validateSchoolId = (
  schoolId: string
): void => {
  if (!Types.ObjectId.isValid(schoolId)) {
    throw new Error('Invalid school ID');
  }
};

const validateUserId = (
  userId: string
): void => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }
};

export const createTeacher = async (
  schoolId: string,
  data: CreateTeacherInput
) => {
  validateSchoolId(schoolId);
  validateUserId(data.userId);

  const user = await User.findOne({
    _id: data.userId,
    schoolId,
    role: UserRole.TEACHER,
    isActive: true,
  });

  if (!user) {
    throw new Error(
      'Teacher user not found or is not an active teacher'
    );
  }

  const existingTeacher =
    await Teacher.findOne({
      schoolId,
      userId: data.userId,
    });

  if (existingTeacher) {
    throw new Error(
      'A teacher profile already exists for this user'
    );
  }

  if (data.employeeNumber) {
    const existingEmployee =
      await Teacher.findOne({
        schoolId,
        employeeNumber:
          data.employeeNumber.trim().toUpperCase(),
      });

    if (existingEmployee) {
      throw new Error(
        'A teacher with this employee number already exists'
      );
    }
  }

  const teacher = await Teacher.create({
    schoolId: new Types.ObjectId(schoolId),
    userId: new Types.ObjectId(data.userId),
    employeeNumber:
      data.employeeNumber
        ?.trim()
        .toUpperCase(),
    qualification:
      data.qualification?.trim(),
    phone: data.phone?.trim(),
    address: data.address?.trim(),
    dateOfEmployment:
      data.dateOfEmployment,
  });

  return teacher;
};

export const getTeachers = async (
  schoolId: string
) => {
  validateSchoolId(schoolId);

  const teachers = await Teacher.find({
    schoolId,
    isActive: true,
  })
    .populate({
      path: 'userId',
      select: 'name email role isActive',
    })
    .sort({
      createdAt: -1,
    });

  return teachers;
};

export const getTeacherById = async (
  teacherId: string,
  schoolId: string
) => {
  if (!Types.ObjectId.isValid(teacherId)) {
    throw new Error('Invalid teacher ID');
  }

  validateSchoolId(schoolId);

  const teacher = await Teacher.findOne({
    _id: teacherId,
    schoolId,
  }).populate({
    path: 'userId',
    select: 'name email role isActive',
  });

  if (!teacher) {
    throw new Error('Teacher not found');
  }

  return teacher;
};

export const updateTeacher = async (
  teacherId: string,
  schoolId: string,
  data: UpdateTeacherInput
) => {
  if (!Types.ObjectId.isValid(teacherId)) {
    throw new Error('Invalid teacher ID');
  }

  validateSchoolId(schoolId);

  const existingTeacher =
    await Teacher.findOne({
      _id: teacherId,
      schoolId,
    });

  if (!existingTeacher) {
    throw new Error('Teacher not found');
  }

  if (data.employeeNumber !== undefined) {
    const employeeNumber =
      data.employeeNumber.trim().toUpperCase();

    const duplicateTeacher =
      await Teacher.findOne({
        schoolId,
        employeeNumber,
        _id: {
          $ne: teacherId,
        },
      });

    if (duplicateTeacher) {
      throw new Error(
        'A teacher with this employee number already exists'
      );
    }
  }

  const updateData = {
    ...(data.employeeNumber !== undefined && {
      employeeNumber:
        data.employeeNumber
          .trim()
          .toUpperCase(),
    }),

    ...(data.qualification !== undefined && {
      qualification:
        data.qualification.trim(),
    }),

    ...(data.phone !== undefined && {
      phone: data.phone.trim(),
    }),

    ...(data.address !== undefined && {
      address: data.address.trim(),
    }),

    ...(data.dateOfEmployment !== undefined && {
      dateOfEmployment:
        data.dateOfEmployment,
    }),

    ...(data.isActive !== undefined && {
      isActive: data.isActive,
    }),
  };

  const teacher =
    await Teacher.findOneAndUpdate(
      {
        _id: teacherId,
        schoolId,
      },
      {
        $set: updateData,
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate({
      path: 'userId',
      select: 'name email role isActive',
    });

  if (!teacher) {
    throw new Error('Teacher not found');
  }

  return teacher;
};

export const deleteTeacher = async (
  teacherId: string,
  schoolId: string
) => {
  if (!Types.ObjectId.isValid(teacherId)) {
    throw new Error('Invalid teacher ID');
  }

  validateSchoolId(schoolId);

  const teacher =
    await Teacher.findOneAndUpdate(
      {
        _id: teacherId,
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
    ).populate({
      path: 'userId',
      select: 'name email role isActive',
    });

  if (!teacher) {
    throw new Error('Teacher not found');
  }

  return teacher;
};