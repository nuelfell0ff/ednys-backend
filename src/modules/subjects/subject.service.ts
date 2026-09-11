import { Types } from 'mongoose';

import { Subject } from './subject.model';

import {
  CreateSubjectInput,
  UpdateSubjectInput,
} from './subject.types';

const validateSchoolId = (
  schoolId: string
): void => {
  if (!Types.ObjectId.isValid(schoolId)) {
    throw new Error('Invalid school ID');
  }
};

export const createSubject = async (
  schoolId: string,
  data: CreateSubjectInput
) => {
  validateSchoolId(schoolId);

  const name = data.name.trim();

  const existingSubject =
    await Subject.findOne({
      schoolId,
      name,
    });

  if (existingSubject) {
    throw new Error(
      'A subject with this name already exists in this school'
    );
  }

  const subject = await Subject.create({
    schoolId: new Types.ObjectId(schoolId),
    name,
    code: data.code?.trim().toUpperCase(),
    description: data.description?.trim(),
  });

  return subject;
};

export const getSubjects = async (
  schoolId: string
) => {
  validateSchoolId(schoolId);

  const subjects = await Subject.find({
    schoolId,
    isActive: true,
  }).sort({
    name: 1,
  });

  return subjects;
};

export const getSubjectById = async (
  subjectId: string,
  schoolId: string
) => {
  if (!Types.ObjectId.isValid(subjectId)) {
    throw new Error('Invalid subject ID');
  }

  validateSchoolId(schoolId);

  const subject = await Subject.findOne({
    _id: subjectId,
    schoolId,
  });

  if (!subject) {
    throw new Error('Subject not found');
  }

  return subject;
};

export const updateSubject = async (
  subjectId: string,
  schoolId: string,
  data: UpdateSubjectInput
) => {
  if (!Types.ObjectId.isValid(subjectId)) {
    throw new Error('Invalid subject ID');
  }

  validateSchoolId(schoolId);

  const existingSubject =
    await Subject.findOne({
      _id: subjectId,
      schoolId,
    });

  if (!existingSubject) {
    throw new Error('Subject not found');
  }

  const name =
    data.name !== undefined
      ? data.name.trim()
      : existingSubject.name;

  if (data.name !== undefined) {
    const duplicateSubject =
      await Subject.findOne({
        schoolId,
        name,
        _id: {
          $ne: subjectId,
        },
      });

    if (duplicateSubject) {
      throw new Error(
        'A subject with this name already exists in this school'
      );
    }
  }

  const updateData = {
    ...(data.name !== undefined && {
      name,
    }),

    ...(data.code !== undefined && {
      code: data.code.trim().toUpperCase(),
    }),

    ...(data.description !== undefined && {
      description: data.description.trim(),
    }),

    ...(data.isActive !== undefined && {
      isActive: data.isActive,
    }),
  };

  const subject =
    await Subject.findOneAndUpdate(
      {
        _id: subjectId,
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

  if (!subject) {
    throw new Error('Subject not found');
  }

  return subject;
};

export const deleteSubject = async (
  subjectId: string,
  schoolId: string
) => {
  if (!Types.ObjectId.isValid(subjectId)) {
    throw new Error('Invalid subject ID');
  }

  validateSchoolId(schoolId);

  const subject =
    await Subject.findOneAndUpdate(
      {
        _id: subjectId,
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

  if (!subject) {
    throw new Error('Subject not found');
  }

  return subject;
};