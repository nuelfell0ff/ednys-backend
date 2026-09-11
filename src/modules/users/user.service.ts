import bcrypt from 'bcryptjs';
import { Types } from 'mongoose';

import { User } from './user.model';
import {
  CreateUserInput,
  UpdateUserInput,
} from './user.types';

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: CreateUserInput['role'];
}

export const createUser = async (
  schoolId: string,
  data: CreateUserData
) => {
  if (!Types.ObjectId.isValid(schoolId)) {
    throw new Error('Invalid school ID');
  }

  const email = data.email
    .toLowerCase()
    .trim();

  const existingUser = await User.findOne({
    schoolId,
    email,
  });

  if (existingUser) {
    throw new Error(
      'A user with this email already exists in this school'
    );
  }

  const passwordHash = await bcrypt.hash(
    data.password,
    12
  );

  const user = await User.create({
    name: data.name.trim(),
    email,
    passwordHash,
    role: data.role,
    schoolId: new Types.ObjectId(schoolId),
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
      ? {
          email: data.email
            .toLowerCase()
            .trim(),
        }
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