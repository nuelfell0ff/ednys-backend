import { Types } from 'mongoose';

import { School } from '../schools/school.model';
import {
  PlatformPaymentConfig,
} from '../platform-payment-config/platform-payment-config.model';

import {
  createPaystackSubaccount,
} from '../../services/paystack-subaccount.service';

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

const createSchoolPaystackSubaccount =
  async (
    schoolId: string,
    data: {
      settlementBankCode: string;
      settlementAccountNumber: string;
    }
  ) => {
    const school =
      await School.findOne({
        _id: schoolId,
        isActive: true,
      });

    if (!school) {
      throw new Error(
        'School not found or inactive'
      );
    }

    const platformConfig =
      await PlatformPaymentConfig.findOne();

    if (!platformConfig) {
      throw new Error(
        'Platform payment configuration not found'
      );
    }

    if (!platformConfig.isEnabled) {
      throw new Error(
        'Platform payment configuration is disabled'
      );
    }

    if (
      platformConfig.platformFeePercentage < 0 ||
      platformConfig.platformFeePercentage > 100
    ) {
      throw new Error(
        'Invalid platform fee percentage'
      );
    }

    const result =
      await createPaystackSubaccount({
        businessName: school.name,
        bankCode:
          data.settlementBankCode,
        accountNumber:
          data.settlementAccountNumber,
        percentageCharge:
          platformConfig.platformFeePercentage,
        description:
          `EDNYS payment account for ${school.name}`,
        primaryContactEmail:
          school.email,
      });

    if (
      !result.status ||
      !result.data?.subaccount_code
    ) {
      throw new Error(
        result.message ||
          'Failed to create Paystack subaccount'
      );
    }

    return result.data;
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

      const subaccount =
        await createSchoolPaystackSubaccount(
          schoolId,
          {
            settlementBankCode:
              data.settlementBankCode!,
            settlementAccountNumber:
              data.settlementAccountNumber!,
          }
        );

      data.paystackSubaccountCode =
        subaccount.subaccount_code;

      data.paystackAccountName =
        subaccount.account_name;

      if (!data.settlementBankName) {
        data.settlementBankName =
          subaccount.settlement_bank;
      }
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
        existingConfig.paystackSubaccountCode,

      paystackAccountName:
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

      if (
        !updatedData.paystackSubaccountCode
      ) {
        const subaccount =
          await createSchoolPaystackSubaccount(
            schoolId,
            {
              settlementBankCode:
                updatedData.settlementBankCode!,
              settlementAccountNumber:
                updatedData.settlementAccountNumber!,
            }
          );

        updatedData.paystackSubaccountCode =
          subaccount.subaccount_code;

        updatedData.paystackAccountName =
          subaccount.account_name;

        if (
          !data.settlementBankName
        ) {
          updatedData.settlementBankName =
            subaccount.settlement_bank;
        }
      }
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