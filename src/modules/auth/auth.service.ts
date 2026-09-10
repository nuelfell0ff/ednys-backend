import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { School } from '../schools/school.model';
import { User, UserRole } from '../users/user.model';

import {
  LoginInput,
  RegisterInput,
} from './auth.types';

interface AuthResult {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    schoolId: string;
  };
  school: {
    id: string;
    name: string;
    slug: string;
  };
  accessToken: string;
}

const generateSchoolSlug = (schoolName: string): string => {
  return schoolName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const generateUniqueSchoolSlug = async (
  schoolName: string
): Promise<string> => {
  const baseSlug = generateSchoolSlug(schoolName);

  let slug = baseSlug;
  let counter = 1;

  while (await School.exists({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return slug;
};

const generateAccessToken = (
  userId: string,
  schoolId: string,
  role: UserRole
): string => {
  const secret = process.env.JWT_ACCESS_SECRET;

  if (!secret) {
    throw new Error('JWT_ACCESS_SECRET is not defined');
  }

  return jwt.sign(
    {
      userId,
      schoolId,
      role,
    },
    secret,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    } as jwt.SignOptions
  );
};

export const registerSchoolAdmin = async (
  data: RegisterInput
): Promise<AuthResult> => {
  const adminEmail = data.adminEmail.toLowerCase().trim();

  const existingUser = await User.findOne({
    email: adminEmail,
  });

  if (existingUser) {
    throw new Error(
      'A user with this email already exists'
    );
  }

  const slug = await generateUniqueSchoolSlug(
    data.schoolName
  );

  const passwordHash = await bcrypt.hash(
    data.adminPassword,
    12
  );

  const school = await School.create({
    name: data.schoolName,
    slug,
    email: data.schoolEmail,
    phone: data.schoolPhone,
    address: data.schoolAddress,
    city: data.schoolCity,
    state: data.schoolState,
    country: 'Nigeria',
  });

  try {
    const admin = await User.create({
      name: data.adminName,
      email: adminEmail,
      passwordHash,
      role: UserRole.ADMIN,
      schoolId: school._id,
    });

    const accessToken = generateAccessToken(
      admin._id.toString(),
      school._id.toString(),
      admin.role
    );

    return {
      user: {
        id: admin._id.toString(),
        name: admin.name,
        email: admin.email,
        role: admin.role,
        schoolId: school._id.toString(),
      },
      school: {
        id: school._id.toString(),
        name: school.name,
        slug: school.slug,
      },
      accessToken,
    };
  } catch (error) {
    await School.findByIdAndDelete(school._id);

    throw error;
  }
};

export const loginUser = async (
  data: LoginInput
): Promise<AuthResult> => {
  const email = data.email.toLowerCase().trim();

  const user = await User.findOne({
    email,
    isActive: true,
  }).select('+passwordHash');

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const passwordMatches = await bcrypt.compare(
    data.password,
    user.passwordHash
  );

  if (!passwordMatches) {
    throw new Error('Invalid email or password');
  }

  const school = await School.findOne({
    _id: user.schoolId,
    isActive: true,
  });

  if (!school) {
    throw new Error(
      'Your school account is inactive or unavailable'
    );
  }

  const accessToken = generateAccessToken(
    user._id.toString(),
    school._id.toString(),
    user.role
  );

  return {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      schoolId: school._id.toString(),
    },
    school: {
      id: school._id.toString(),
      name: school.name,
      slug: school.slug,
    },
    accessToken,
  };
};