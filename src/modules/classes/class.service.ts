import { Types } from 'mongoose';

import { Class } from './class.model';

import {
  CreateClassInput,
  UpdateClassInput,
} from './class.types';

const validateObjectId = (
  value: string,
  fieldName: string
): void => {
  if (!Types.ObjectId.isValid(value)) {
    throw new Error(`Invalid ${fieldName}`);
  }
};

export const createClass = async (
  schoolId: string,
  data: CreateClassInput
) => {
  validateObjectId(schoolId, 'school ID');
  validateObjectId(
    data.academicSessionId,
    'academic session ID'
  );

  const name = data.name.trim();

  const existingClass = await Class.findOne({
    schoolId,
    academicSessionId: data.academicSessionId,
    name,
  });

  if (existingClass) {
    throw new Error(
      'A class with this name already exists in this academic session'
    );
  }

  const newClass = await Class.create({
    schoolId: new Types.ObjectId(schoolId),
    academicSessionId: new Types.ObjectId(
      data.academicSessionId
    ),
    name,
    code: data.code?.trim().toUpperCase(),
    level: data.level?.trim(),
    capacity: data.capacity,
  });

  return newClass;
};

export const getClasses = async (
  schoolId: string,
  academicSessionId?: string
) => {
  validateObjectId(schoolId, 'school ID');

  if (academicSessionId) {
    validateObjectId(
      academicSessionId,
      'academic session ID'
    );
  }

  const filter: {
    schoolId: string;
    academicSessionId?: string;
    isActive: boolean;
  } = {
    schoolId,
    isActive: true,
  };

  if (academicSessionId) {
    filter.academicSessionId =
      academicSessionId;
  }

  const classes = await Class.find(filter)
    .sort({
      name: 1,
    });

  return classes;
};

export const getClassById = async (
  classId: string,
  schoolId: string
) => {
  validateObjectId(classId, 'class ID');
  validateObjectId(schoolId, 'school ID');

  const classRecord = await Class.findOne({
    _id: classId,
    schoolId,
  });

  if (!classRecord) {
    throw new Error('Class not found');
  }

  return classRecord;
};

export const updateClass = async (
  classId: string,
  schoolId: string,
  data: UpdateClassInput
) => {
  validateObjectId(classId, 'class ID');
  validateObjectId(schoolId, 'school ID');

  if (data.academicSessionId) {
    validateObjectId(
      data.academicSessionId,
      'academic session ID'
    );
  }

  const existingClass = await Class.findOne({
    _id: classId,
    schoolId,
  });

  if (!existingClass) {
    throw new Error('Class not found');
  }

  const academicSessionId =
    data.academicSessionId ??
    existingClass.academicSessionId.toString();

  const name =
    data.name !== undefined
      ? data.name.trim()
      : existingClass.name;

  const duplicateClass =
    await Class.findOne({
      schoolId,
      academicSessionId,
      name,
      _id: {
        $ne: classId,
      },
    });

  if (duplicateClass) {
    throw new Error(
      'A class with this name already exists in this academic session'
    );
  }

  const updateData = {
    ...(data.academicSessionId !== undefined && {
      academicSessionId:
        new Types.ObjectId(
          data.academicSessionId
        ),
    }),

    ...(data.name !== undefined && {
      name,
    }),

    ...(data.code !== undefined && {
      code: data.code.trim().toUpperCase(),
    }),

    ...(data.level !== undefined && {
      level: data.level.trim(),
    }),

    ...(data.capacity !== undefined && {
      capacity: data.capacity,
    }),

    ...(data.isActive !== undefined && {
      isActive: data.isActive,
    }),
  };

  const updatedClass =
    await Class.findOneAndUpdate(
      {
        _id: classId,
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

  if (!updatedClass) {
    throw new Error('Class not found');
  }

  return updatedClass;
};

export const deleteClass = async (
  classId: string,
  schoolId: string
) => {
  validateObjectId(classId, 'class ID');
  validateObjectId(schoolId, 'school ID');

  const classRecord =
    await Class.findOneAndUpdate(
      {
        _id: classId,
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

  if (!classRecord) {
    throw new Error('Class not found');
  }

  return classRecord;
};