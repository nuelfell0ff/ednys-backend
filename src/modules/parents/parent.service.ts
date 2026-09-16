import { Types } from 'mongoose';

import { Parent } from './parent.model';
import {
  CreateParentInput,
  UpdateParentInput,
} from './parent.types';

import {
  User,
  UserRole,
} from '../users/user.model';

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

const getParentUser = async (
  userId: string,
  schoolId: string
) => {
  validateObjectId(
    userId,
    'Invalid user ID'
  );

  validateSchoolId(schoolId);

  const user = await User.findOne({
    _id: userId,
    schoolId,
    role: UserRole.PARENT,
    isActive: true,
  });

  if (!user) {
    throw new Error(
      'Active parent user not found'
    );
  }

  return user;
};

export const createParent = async (
  schoolId: string,
  data: CreateParentInput
) => {
  validateSchoolId(schoolId);

  const user = await getParentUser(
    data.userId,
    schoolId
  );

  const existingParent =
    await Parent.findOne({
      schoolId,
      userId: user._id,
    });

  if (existingParent) {
    throw new Error(
      'A parent profile already exists for this user'
    );
  }

  const parent = await Parent.create({
    userId: user._id,
    schoolId,
    phone: data.phone?.trim(),
    address: data.address?.trim(),
    occupation: data.occupation?.trim(),
    isActive: true,
  });

  return parent;
};

export const getParents = async (
  schoolId: string
) => {
  validateSchoolId(schoolId);

  const parents =
    await Parent.find({
      schoolId,
    })
      .populate({
        path: 'userId',
        select:
          'name email role isActive',
      })
      .sort({
        createdAt: -1,
      });

  return parents;
};

export const getParentById = async (
  schoolId: string,
  parentId: string
) => {
  validateSchoolId(schoolId);

  validateObjectId(
    parentId,
    'Invalid parent ID'
  );

  const parent =
    await Parent.findOne({
      _id: parentId,
      schoolId,
    }).populate({
      path: 'userId',
      select:
        'name email role isActive',
    });

  if (!parent) {
    throw new Error(
      'Parent not found'
    );
  }

  return parent;
};

export const getParentByUserId = async (
  schoolId: string,
  userId: string
) => {
  validateSchoolId(schoolId);

  validateObjectId(
    userId,
    'Invalid user ID'
  );

  const parent =
    await Parent.findOne({
      schoolId,
      userId,
    }).populate({
      path: 'userId',
      select:
        'name email role isActive',
    });

  if (!parent) {
    throw new Error(
      'Parent profile not found'
    );
  }

  return parent;
};

export const updateParent = async (
  schoolId: string,
  parentId: string,
  data: UpdateParentInput
) => {
  validateSchoolId(schoolId);

  validateObjectId(
    parentId,
    'Invalid parent ID'
  );

  const parent =
    await Parent.findOne({
      _id: parentId,
      schoolId,
    });

  if (!parent) {
    throw new Error(
      'Parent not found'
    );
  }

  if (data.phone !== undefined) {
    parent.phone =
      data.phone.trim();
  }

  if (data.address !== undefined) {
    parent.address =
      data.address.trim();
  }

  if (
    data.occupation !== undefined
  ) {
    parent.occupation =
      data.occupation.trim();
  }

  if (data.isActive !== undefined) {
    parent.isActive =
      data.isActive;
  }

  await parent.save();

  return parent;
};