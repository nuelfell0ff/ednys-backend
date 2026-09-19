import { Types } from 'mongoose';

import {
  SchoolPaymentConfig,
} from './school-payment-config.model';

import {
  CreateSchoolPaymentConfigInput,
  UpdateSchoolPaymentConfigInput,
} from './school-payment-config.types';

const validateSchoolId = (
  schoolId: string
): void => {
  if (!Types.ObjectId.isValid(schoolId)) {
    throw new Error('Invalid school ID');
  }
};

const validatePaystackConfiguration = (
  data: {
    paystackSubaccountCode?: string;
    settlementBankCode?: string;
    settlementBankName?: string;
    settlementAccountNumber?: string;
  }
): void => {
  if (
    !data.paystackSubaccountCode
  ) {
    throw new Error(
      'Paystack subaccount code is required'
    );
  }

  if (!data.settlementBankCode) {
    throw new Error(
      'Settlement bank code is required'
    );
  }

  if (!data.settlementBankName) {
    throw new Error(
      'Settlement bank name is required'
    );
  }

  if (
    !data.settlementAccountNumber
  ) {
    throw new Error(
      'Settlement account number is required'
    );
  }
};

export const createSchoolPaymentConfig =
  async (
    schoolId: string,
    data: CreateSchoolPaymentConfigInput
  ) => {
    validateSchoolId(schoolId);

    const existingConfig =
      await SchoolPaymentConfig.findOne({
        schoolId,
      });

    if (existingConfig) {
      throw new Error(
        'Payment configuration already exists for this school'
      );
    }

    if (data.isEnabled) {
      validatePaystackConfiguration(
        data
      );
    }

    const config =
      await SchoolPaymentConfig.create({
        schoolId:
          new Types.ObjectId(schoolId),
        paystackSubaccountCode:
          data.paystackSubaccountCode,
        paystackAccountName:
          data.paystackAccountName,
        settlementBankCode:
          data.settlementBankCode,
        settlementBankName:
          data.settlementBankName,
        settlementAccountNumber:
          data.settlementAccountNumber,
        isEnabled:
          data.isEnabled ?? false,
      });

    return config;
  };

export const getSchoolPaymentConfig =
  async (
    schoolId: string
  ) => {
    validateSchoolId(schoolId);

    const config =
      await SchoolPaymentConfig.findOne({
        schoolId,
      });

    if (!config) {
      throw new Error(
        'Payment configuration not found'
      );
    }

    return config;
  };

export const updateSchoolPaymentConfig =
  async (
    schoolId: string,
    data: UpdateSchoolPaymentConfigInput
  ) => {
    validateSchoolId(schoolId);

    const existingConfig =
      await SchoolPaymentConfig.findOne({
        schoolId,
      });

    if (!existingConfig) {
      throw new Error(
        'Payment configuration not found'
      );
    }

    const updatedData = {
      paystackSubaccountCode:
        data.paystackSubaccountCode ??
        existingConfig.paystackSubaccountCode,

      paystackAccountName:
        data.paystackAccountName ??
        existingConfig.paystackAccountName,

      settlementBankCode:
        data.settlementBankCode ??
        existingConfig.settlementBankCode,

      settlementBankName:
        data.settlementBankName ??
        existingConfig.settlementBankName,

      settlementAccountNumber:
        data.settlementAccountNumber ??
        existingConfig.settlementAccountNumber,

      isEnabled:
        data.isEnabled ??
        existingConfig.isEnabled,
    };

    if (updatedData.isEnabled) {
      validatePaystackConfiguration(
        updatedData
      );
    }

    existingConfig.paystackSubaccountCode =
      updatedData.paystackSubaccountCode;

    existingConfig.paystackAccountName =
      updatedData.paystackAccountName;

    existingConfig.settlementBankCode =
      updatedData.settlementBankCode;

    existingConfig.settlementBankName =
      updatedData.settlementBankName;

    existingConfig.settlementAccountNumber =
      updatedData.settlementAccountNumber;

    existingConfig.isEnabled =
      updatedData.isEnabled;

    await existingConfig.save();

    return existingConfig;
  };

export const disableSchoolPaymentConfig =
  async (
    schoolId: string
  ) => {
    validateSchoolId(schoolId);

    const config =
      await SchoolPaymentConfig.findOneAndUpdate(
        {
          schoolId,
        },
        {
          $set: {
            isEnabled: false,
          },
        },
        {
          new: true,
        }
      );

    if (!config) {
      throw new Error(
        'Payment configuration not found'
      );
    }

    return config;
  };