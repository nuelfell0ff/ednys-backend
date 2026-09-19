import { School } from './school.model';
import {
  CreateSchoolInput,
  UpdateSchoolInput,
} from './school.types';
import { UserRole } from '../users/user.model';

const subdomainPattern =
  /^(?!-)[a-z0-9-]+(?<!-)$/;

const normalizeSubdomain = (
  subdomain: string
): string => {
  const normalized =
    subdomain.trim().toLowerCase();

  if (
    !normalized ||
    normalized.length > 63 ||
    !subdomainPattern.test(normalized)
  ) {
    throw new Error(
      'Invalid subdomain. Use only lowercase letters, numbers, and hyphens, without starting or ending with a hyphen'
    );
  }

  return normalized;
};

const normalizeSlug = (
  slug: string
): string => {
  return slug.trim().toLowerCase();
};

const validateSchoolAccess = async (
  schoolId: string,
  userId: string,
  role: UserRole,
  userSchoolId?: string
) => {
  if (role === UserRole.SUPER_ADMIN) {
    return;
  }

  if (role !== UserRole.ADMIN) {
    throw new Error(
      'You do not have permission to access this school'
    );
  }

  if (!userSchoolId) {
    throw new Error(
      'School access is not configured for this user'
    );
  }

  if (userSchoolId !== schoolId) {
    throw new Error(
      'You do not have permission to access this school'
    );
  }

  if (userId.trim() === '') {
    throw new Error(
      'Invalid user'
    );
  }
};

export const createSchool = async (
  data: CreateSchoolInput
) => {
  const slug =
    normalizeSlug(data.slug);

  const subdomain =
    normalizeSubdomain(
      data.subdomain
    );

  const existingSchoolBySlug =
    await School.findOne({
      slug,
    });

  if (existingSchoolBySlug) {
    throw new Error(
      'A school with this slug already exists'
    );
  }

  const existingSchoolBySubdomain =
    await School.findOne({
      subdomain,
    });

  if (existingSchoolBySubdomain) {
    throw new Error(
      'A school with this subdomain already exists'
    );
  }

  const school =
    await School.create({
      ...data,
      slug,
      subdomain,
    });

  return school;
};

export const getSchoolById =
  async (
    schoolId: string,
    userId: string,
    role: UserRole,
    userSchoolId?: string
  ) => {
    await validateSchoolAccess(
      schoolId,
      userId,
      role,
      userSchoolId
    );

    const school =
      await School.findById(
        schoolId
      );

    if (!school) {
      throw new Error(
        'School not found'
      );
    }

    return school;
  };

export const updateSchool = async (
  schoolId: string,
  data: UpdateSchoolInput,
  userId: string,
  role: UserRole,
  userSchoolId?: string
) => {
  await validateSchoolAccess(
    schoolId,
    userId,
    role,
    userSchoolId
  );

  const updateData: UpdateSchoolInput = {
    ...(data.name !== undefined && {
      name: data.name,
    }),
    ...(data.email !== undefined && {
      email: data.email,
    }),
    ...(data.phone !== undefined && {
      phone: data.phone,
    }),
    ...(data.address !== undefined && {
      address: data.address,
    }),
    ...(data.city !== undefined && {
      city: data.city,
    }),
    ...(data.state !== undefined && {
      state: data.state,
    }),
    ...(data.country !== undefined && {
      country: data.country,
    }),
  };

  const school =
    await School.findByIdAndUpdate(
      schoolId,
      {
        $set: updateData,
      },
      {
        new: true,
        runValidators: true,
      }
    );

  if (!school) {
    throw new Error(
      'School not found'
    );
  }

  return school;
};