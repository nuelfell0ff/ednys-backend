import { Types } from 'mongoose';

import { FeeCategory } from './fee-category.model';
import {
  CreateFeeCategoryInput,
  UpdateFeeCategoryInput,
} from './fee-category.types';

const validateSchoolId = (
  schoolId: string
): void => {
  if (!Types.ObjectId.isValid(schoolId)) {
    throw new Error('Invalid school ID');
  }
};

const validateFeeCategoryId = (
  feeCategoryId: string
): void => {
  if (!Types.ObjectId.isValid(feeCategoryId)) {
    throw new Error('Invalid fee category ID');
  }
};

const normalizeOptionalString = (
  value?: string
): string | undefined => {
  const normalized = value?.trim();

  return normalized || undefined;
};

export const createFeeCategory = async (
  schoolId: string,
  data: CreateFeeCategoryInput
) => {
  validateSchoolId(schoolId);

  const name = data.name.trim();

  const existingCategory =
    await FeeCategory.findOne({
      schoolId,
      name: {
        $regex: `^${name.replace(
          /[.*+?^${}()|[\]\\]/g,
          '\\$&'
        )}$`,
        $options: 'i',
      },
    });

  if (existingCategory) {
    throw new Error(
      'A fee category with this name already exists'
    );
  }

  const feeCategory =
    await FeeCategory.create({
      schoolId: new Types.ObjectId(
        schoolId
      ),
      name,
      description:
        normalizeOptionalString(
          data.description
        ),
    });

  return feeCategory;
};

export const getFeeCategories = async (
  schoolId: string
) => {
  validateSchoolId(schoolId);

  const feeCategories =
    await FeeCategory.find({
      schoolId,
      isActive: true,
    }).sort({
      name: 1,
    });

  return feeCategories;
};

export const getFeeCategoryById =
  async (
    feeCategoryId: string,
    schoolId: string
  ) => {
    validateFeeCategoryId(
      feeCategoryId
    );
    validateSchoolId(schoolId);

    const feeCategory =
      await FeeCategory.findOne({
        _id: feeCategoryId,
        schoolId,
      });

    if (!feeCategory) {
      throw new Error(
        'Fee category not found'
      );
    }

    return feeCategory;
  };

export const updateFeeCategory =
  async (
    feeCategoryId: string,
    schoolId: string,
    data: UpdateFeeCategoryInput
  ) => {
    validateFeeCategoryId(
      feeCategoryId
    );
    validateSchoolId(schoolId);

    const existingCategory =
      await FeeCategory.findOne({
        _id: feeCategoryId,
        schoolId,
      });

    if (!existingCategory) {
      throw new Error(
        'Fee category not found'
      );
    }

    const updateData: {
      name?: string;
      description?: string;
      isActive?: boolean;
    } = {};

    if (data.name !== undefined) {
      const name = data.name.trim();

      const duplicateCategory =
        await FeeCategory.findOne({
          schoolId,
          _id: {
            $ne: feeCategoryId,
          },
          name: {
            $regex: `^${name.replace(
              /[.*+?^${}()|[\]\\]/g,
              '\\$&'
            )}$`,
            $options: 'i',
          },
        });

      if (duplicateCategory) {
        throw new Error(
          'A fee category with this name already exists'
        );
      }

      updateData.name = name;
    }

    if (
      data.description !== undefined
    ) {
      updateData.description =
        normalizeOptionalString(
          data.description
        );
    }

    if (
      data.isActive !== undefined
    ) {
      updateData.isActive =
        data.isActive;
    }

    const feeCategory =
      await FeeCategory.findOneAndUpdate(
        {
          _id: feeCategoryId,
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

    if (!feeCategory) {
      throw new Error(
        'Fee category not found'
      );
    }

    return feeCategory;
  };

export const deleteFeeCategory =
  async (
    feeCategoryId: string,
    schoolId: string
  ) => {
    validateFeeCategoryId(
      feeCategoryId
    );
    validateSchoolId(schoolId);

    const feeCategory =
      await FeeCategory.findOneAndUpdate(
        {
          _id: feeCategoryId,
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

    if (!feeCategory) {
      throw new Error(
        'Fee category not found'
      );
    }

    return feeCategory;
  };