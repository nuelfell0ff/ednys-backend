import { Types } from 'mongoose';
import { User } from './user.model';
import {
  CreateUserInput,
  UpdateUserInput,
} from './user.types';

export const createUser = async (
  data: CreateUserInput
) => {
  if (!Types.ObjectId.isValid(data.schoolId)) {
    throw new Error('Invalid school ID');
  }

  const existingUser = await User.findOne({
    schoolId: data.schoolId,
    email: data.email.toLowerCase(),
  });

  if (existingUser) {
    throw new Error(
      'A user with this email already exists in this school'
    );
  }

  const user = await User.create({
    ...data,
    email: data.email.toLowerCase(),
    schoolId: new Types.ObjectId(data.schoolId),
  });

  return user;
};

export const getUserById = async (
  userId: string,
  schoolId: string
) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }

  if (!Types.ObjectId.isValid(schoolId)) {
    throw new Error('Invalid school ID');
  }

  const user = await User.findOne({
    _id: userId,
    schoolId,
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

export const getUserByEmail = async (
  email: string,
  schoolId: string
) => {
  if (!Types.ObjectId.isValid(schoolId)) {
    throw new Error('Invalid school ID');
  }

  const user = await User.findOne({
    email: email.toLowerCase(),
    schoolId,
  }).select('+passwordHash');

  return user;
};

export const updateUser = async (
  userId: string,
  schoolId: string,
  data: UpdateUserInput
) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }

  if (!Types.ObjectId.isValid(schoolId)) {
    throw new Error('Invalid school ID');
  }

  const updateData = {
    ...data,
    ...(data.email
      ? { email: data.email.toLowerCase() }
      : {}),
  };

  const user = await User.findOneAndUpdate(
    {
      _id: userId,
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

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};