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

const normalizeOptionalString = (
  value?: string
): string | undefined => {
  const normalized = value?.trim();

  return normalized || undefined;
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

  const employeeNumber =
    normalizeOptionalString(
      data.employeeNumber
    )?.toUpperCase();

  if (employeeNumber) {
    const existingEmployee =
      await Teacher.findOne({
        schoolId,
        employeeNumber,
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
    employeeNumber,
    qualification:
      normalizeOptionalString(
        data.qualification
      ),
    phone: normalizeOptionalString(
      data.phone
    ),
    address: normalizeOptionalString(
      data.address
    ),
    dateOfEmployment:
      data.dateOfEmployment
        ? new Date(data.dateOfEmployment)
        : undefined,
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

  const employeeNumber =
    data.employeeNumber !== undefined
      ? normalizeOptionalString(
          data.employeeNumber
        )?.toUpperCase()
      : undefined;

  if (
    data.employeeNumber !== undefined &&
    employeeNumber
  ) {
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
      employeeNumber,
    }),

    ...(data.qualification !== undefined && {
      qualification:
        normalizeOptionalString(
          data.qualification
        ),
    }),

    ...(data.phone !== undefined && {
      phone: normalizeOptionalString(
        data.phone
      ),
    }),

    ...(data.address !== undefined && {
      address: normalizeOptionalString(
        data.address
      ),
    }),

    ...(data.dateOfEmployment !== undefined && {
      dateOfEmployment:
        new Date(data.dateOfEmployment),
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