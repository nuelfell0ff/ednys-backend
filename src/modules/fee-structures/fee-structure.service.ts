import { Types } from 'mongoose';

import { FeeStructure } from './fee-structure.model';
import {
  CreateFeeStructureInput,
  UpdateFeeStructureInput,
} from './fee-structure.types';

import { AcademicSession } from '../academic-sessions/academic-session.model';
import { Class } from '../classes/class.model';
import { FeeCategory } from '../fee-categories/fee-category.model';

const validateSchoolId = (
  schoolId: string
): void => {
  if (!Types.ObjectId.isValid(schoolId)) {
    throw new Error('Invalid school ID');
  }
};

const validateId = (
  id: string,
  fieldName: string
): void => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error(`Invalid ${fieldName}`);
  }
};

const normalizeDate = (
  value?: string
): Date | undefined => {
  if (value === undefined) {
    return undefined;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid date');
  }

  return date;
};

export const createFeeStructure = async (
  schoolId: string,
  data: CreateFeeStructureInput
) => {
  validateSchoolId(schoolId);
  validateId(
    data.academicSessionId,
    'academic session ID'
  );
  validateId(
    data.classId,
    'class ID'
  );
  validateId(
    data.feeCategoryId,
    'fee category ID'
  );

  const academicSession =
    await AcademicSession.findOne({
      _id: data.academicSessionId,
      schoolId,
    });

  if (!academicSession) {
    throw new Error(
      'Academic session not found'
    );
  }

  const schoolClass =
    await Class.findOne({
      _id: data.classId,
      schoolId,
    });

  if (!schoolClass) {
    throw new Error('Class not found');
  }

  const feeCategory =
    await FeeCategory.findOne({
      _id: data.feeCategoryId,
      schoolId,
      isActive: true,
    });

  if (!feeCategory) {
    throw new Error(
      'Active fee category not found'
    );
  }

  const existingStructure =
    await FeeStructure.findOne({
      schoolId,
      academicSessionId:
        data.academicSessionId,
      term: data.term,
      classId: data.classId,
      feeCategoryId:
        data.feeCategoryId,
    });

  if (existingStructure) {
    throw new Error(
      'A fee structure already exists for this class, term, session and fee category'
    );
  }

  const dueDate = normalizeDate(
    data.dueDate
  );

  const feeStructure =
    await FeeStructure.create({
      schoolId: new Types.ObjectId(
        schoolId
      ),
      academicSessionId:
        new Types.ObjectId(
          data.academicSessionId
        ),
      term: data.term,
      classId: new Types.ObjectId(
        data.classId
      ),
      feeCategoryId:
        new Types.ObjectId(
          data.feeCategoryId
        ),
      amount: data.amount,
      dueDate,
      isMandatory:
        data.isMandatory ?? true,
    });

  return feeStructure.populate([
    {
      path: 'academicSessionId',
      select: 'name startDate endDate isActive',
    },
    {
      path: 'classId',
      select: 'name',
    },
    {
      path: 'feeCategoryId',
      select: 'name description isActive',
    },
  ]);
};

export const getFeeStructures = async (
  schoolId: string
) => {
  validateSchoolId(schoolId);

  const feeStructures =
    await FeeStructure.find({
      schoolId,
      isActive: true,
    })
      .populate({
        path: 'academicSessionId',
        select:
          'name startDate endDate isActive',
      })
      .populate({
        path: 'classId',
        select: 'name',
      })
      .populate({
        path: 'feeCategoryId',
        select:
          'name description isActive',
      })
      .sort({
        academicSessionId: 1,
        term: 1,
        createdAt: -1,
      });

  return feeStructures;
};

export const getFeeStructureById =
  async (
    feeStructureId: string,
    schoolId: string
  ) => {
    validateId(
      feeStructureId,
      'fee structure ID'
    );
    validateSchoolId(schoolId);

    const feeStructure =
      await FeeStructure.findOne({
        _id: feeStructureId,
        schoolId,
      })
        .populate({
          path: 'academicSessionId',
          select:
            'name startDate endDate isActive',
        })
        .populate({
          path: 'classId',
          select: 'name',
        })
        .populate({
          path: 'feeCategoryId',
          select:
            'name description isActive',
        });

    if (!feeStructure) {
      throw new Error(
        'Fee structure not found'
      );
    }

    return feeStructure;
  };

export const updateFeeStructure =
  async (
    feeStructureId: string,
    schoolId: string,
    data: UpdateFeeStructureInput
  ) => {
    validateId(
      feeStructureId,
      'fee structure ID'
    );
    validateSchoolId(schoolId);

    const existingStructure =
      await FeeStructure.findOne({
        _id: feeStructureId,
        schoolId,
      });

    if (!existingStructure) {
      throw new Error(
        'Fee structure not found'
      );
    }

    const academicSessionId =
      data.academicSessionId ??
      existingStructure.academicSessionId.toString();

    const term =
      data.term ??
      existingStructure.term;

    const classId =
      data.classId ??
      existingStructure.classId.toString();

    const feeCategoryId =
      data.feeCategoryId ??
      existingStructure.feeCategoryId.toString();

    validateId(
      academicSessionId,
      'academic session ID'
    );
    validateId(
      classId,
      'class ID'
    );
    validateId(
      feeCategoryId,
      'fee category ID'
    );

    if (
      data.academicSessionId !==
      undefined
    ) {
      const academicSession =
        await AcademicSession.findOne({
          _id: data.academicSessionId,
          schoolId,
        });

      if (!academicSession) {
        throw new Error(
          'Academic session not found'
        );
      }
    }

    if (
      data.classId !== undefined
    ) {
      const schoolClass =
        await Class.findOne({
          _id: data.classId,
          schoolId,
        });

      if (!schoolClass) {
        throw new Error(
          'Class not found'
        );
      }
    }

    if (
      data.feeCategoryId !==
      undefined
    ) {
      const feeCategory =
        await FeeCategory.findOne({
          _id: data.feeCategoryId,
          schoolId,
          isActive: true,
        });

      if (!feeCategory) {
        throw new Error(
          'Active fee category not found'
        );
      }
    }

    const duplicateStructure =
      await FeeStructure.findOne({
        schoolId,
        academicSessionId,
        term,
        classId,
        feeCategoryId,
        _id: {
          $ne: feeStructureId,
        },
      });

    if (duplicateStructure) {
      throw new Error(
        'A fee structure already exists for this class, term, session and fee category'
      );
    }

    const updateData: {
      academicSessionId?: Types.ObjectId;
      term?: UpdateFeeStructureInput['term'];
      classId?: Types.ObjectId;
      feeCategoryId?: Types.ObjectId;
      amount?: number;
      dueDate?: Date;
      isMandatory?: boolean;
      isActive?: boolean;
    } = {};

    if (
      data.academicSessionId !==
      undefined
    ) {
      updateData.academicSessionId =
        new Types.ObjectId(
          data.academicSessionId
        );
    }

    if (data.term !== undefined) {
      updateData.term = data.term;
    }

    if (data.classId !== undefined) {
      updateData.classId =
        new Types.ObjectId(
          data.classId
        );
    }

    if (
      data.feeCategoryId !==
      undefined
    ) {
      updateData.feeCategoryId =
        new Types.ObjectId(
          data.feeCategoryId
        );
    }

    if (data.amount !== undefined) {
      updateData.amount = data.amount;
    }

    if (data.dueDate !== undefined) {
      updateData.dueDate =
        normalizeDate(
          data.dueDate
        ) as Date;
    }

    if (
      data.isMandatory !== undefined
    ) {
      updateData.isMandatory =
        data.isMandatory;
    }

    if (
      data.isActive !== undefined
    ) {
      updateData.isActive =
        data.isActive;
    }

    const feeStructure =
      await FeeStructure.findOneAndUpdate(
        {
          _id: feeStructureId,
          schoolId,
        },
        {
          $set: updateData,
        },
        {
          new: true,
          runValidators: true,
        }
      )
        .populate({
          path: 'academicSessionId',
          select:
            'name startDate endDate isActive',
        })
        .populate({
          path: 'classId',
          select: 'name',
        })
        .populate({
          path: 'feeCategoryId',
          select:
            'name description isActive',
        });

    if (!feeStructure) {
      throw new Error(
        'Fee structure not found'
      );
    }

    return feeStructure;
  };

export const deleteFeeStructure =
  async (
    feeStructureId: string,
    schoolId: string
  ) => {
    validateId(
      feeStructureId,
      'fee structure ID'
    );
    validateSchoolId(schoolId);

    const feeStructure =
      await FeeStructure.findOneAndUpdate(
        {
          _id: feeStructureId,
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
      )
        .populate({
          path: 'academicSessionId',
          select:
            'name startDate endDate isActive',
        })
        .populate({
          path: 'classId',
          select: 'name',
        })
        .populate({
          path: 'feeCategoryId',
          select:
            'name description isActive',
        });

    if (!feeStructure) {
      throw new Error(
        'Fee structure not found'
      );
    }

    return feeStructure;
  };