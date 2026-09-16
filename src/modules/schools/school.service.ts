import { School } from './school.model';
import {
  CreateSchoolInput,
  UpdateSchoolInput,
} from './school.types';

export const createSchool = async (
  data: CreateSchoolInput
) => {
  const existingSchoolBySlug = await School.findOne({
    slug: data.slug,
  });

  if (existingSchoolBySlug) {
    throw new Error('A school with this slug already exists');
  }

  const existingSchoolBySubdomain = await School.findOne({
    subdomain: data.subdomain,
  });

  if (existingSchoolBySubdomain) {
    throw new Error('A school with this subdomain already exists');
  }

  const school = await School.create(data);

  return school;
};

export const getSchoolById = async (schoolId: string) => {
  const school = await School.findById(schoolId);

  if (!school) {
    throw new Error('School not found');
  }

  return school;
};

export const updateSchool = async (
  schoolId: string,
  data: UpdateSchoolInput
) => {
  const school = await School.findByIdAndUpdate(
    schoolId,
    { $set: data },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!school) {
    throw new Error('School not found');
  }

  return school;
};