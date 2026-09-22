"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disableSchoolPaymentConfig = exports.updateSchoolPaymentConfig = exports.getSchoolPaymentConfig = exports.createSchoolPaymentConfig = void 0;
const mongoose_1 = require("mongoose");
const school_model_1 = require("../schools/school.model");
const platform_payment_config_model_1 = require("../platform-payment-config/platform-payment-config.model");
const paystack_subaccount_service_1 = require("../../services/paystack-subaccount.service");
const school_payment_config_model_1 = require("./school-payment-config.model");
const validateSchoolId = (schoolId) => {
    if (!mongoose_1.Types.ObjectId.isValid(schoolId)) {
        throw new Error('Invalid school ID');
    }
};
const validatePaystackConfiguration = (data) => {
    if (!data.settlementBankCode) {
        throw new Error('Settlement bank code is required');
    }
    if (!data.settlementBankName) {
        throw new Error('Settlement bank name is required');
    }
    if (!data.settlementAccountNumber) {
        throw new Error('Settlement account number is required');
    }
};
const createSchoolPaystackSubaccount = async (schoolId, data) => {
    const school = await school_model_1.School.findOne({
        _id: schoolId,
        isActive: true,
    });
    if (!school) {
        throw new Error('School not found or inactive');
    }
    const platformConfig = await platform_payment_config_model_1.PlatformPaymentConfig.findOne();
    if (!platformConfig) {
        throw new Error('Platform payment configuration not found');
    }
    if (!platformConfig.isEnabled) {
        throw new Error('Platform payment configuration is disabled');
    }
    if (platformConfig.platformFeePercentage < 0 ||
        platformConfig.platformFeePercentage > 100) {
        throw new Error('Invalid platform fee percentage');
    }
    const result = await (0, paystack_subaccount_service_1.createPaystackSubaccount)({
        businessName: school.name,
        bankCode: data.settlementBankCode,
        accountNumber: data.settlementAccountNumber,
        percentageCharge: platformConfig.platformFeePercentage,
        description: `EDNYS payment account for ${school.name}`,
        primaryContactEmail: school.email,
    });
    if (!result.status ||
        !result.data?.subaccount_code) {
        throw new Error(result.message ||
            'Failed to create Paystack subaccount');
    }
    return result.data;
};
const createSchoolPaymentConfig = async (schoolId, data) => {
    validateSchoolId(schoolId);
    const existingConfig = await school_payment_config_model_1.SchoolPaymentConfig.findOne({
        schoolId,
    });
    if (existingConfig) {
        throw new Error('Payment configuration already exists for this school');
    }
    if (data.isEnabled) {
        validatePaystackConfiguration(data);
        const subaccount = await createSchoolPaystackSubaccount(schoolId, {
            settlementBankCode: data.settlementBankCode,
            settlementAccountNumber: data.settlementAccountNumber,
        });
        data.paystackSubaccountCode =
            subaccount.subaccount_code;
        data.paystackAccountName =
            subaccount.account_name;
        if (!data.settlementBankName) {
            data.settlementBankName =
                subaccount.settlement_bank;
        }
    }
    const config = await school_payment_config_model_1.SchoolPaymentConfig.create({
        schoolId: new mongoose_1.Types.ObjectId(schoolId),
        paystackSubaccountCode: data.paystackSubaccountCode,
        paystackAccountName: data.paystackAccountName,
        settlementBankCode: data.settlementBankCode,
        settlementBankName: data.settlementBankName,
        settlementAccountNumber: data.settlementAccountNumber,
        isEnabled: data.isEnabled ?? false,
    });
    return config;
};
exports.createSchoolPaymentConfig = createSchoolPaymentConfig;
const getSchoolPaymentConfig = async (schoolId) => {
    validateSchoolId(schoolId);
    const config = await school_payment_config_model_1.SchoolPaymentConfig.findOne({
        schoolId,
    });
    if (!config) {
        throw new Error('Payment configuration not found');
    }
    return config;
};
exports.getSchoolPaymentConfig = getSchoolPaymentConfig;
const updateSchoolPaymentConfig = async (schoolId, data) => {
    validateSchoolId(schoolId);
    const existingConfig = await school_payment_config_model_1.SchoolPaymentConfig.findOne({
        schoolId,
    });
    if (!existingConfig) {
        throw new Error('Payment configuration not found');
    }
    const updatedData = {
        paystackSubaccountCode: existingConfig.paystackSubaccountCode,
        paystackAccountName: existingConfig.paystackAccountName,
        settlementBankCode: data.settlementBankCode ??
            existingConfig.settlementBankCode,
        settlementBankName: data.settlementBankName ??
            existingConfig.settlementBankName,
        settlementAccountNumber: data.settlementAccountNumber ??
            existingConfig.settlementAccountNumber,
        isEnabled: data.isEnabled ??
            existingConfig.isEnabled,
    };
    if (updatedData.isEnabled) {
        validatePaystackConfiguration(updatedData);
        if (!updatedData.paystackSubaccountCode) {
            const subaccount = await createSchoolPaystackSubaccount(schoolId, {
                settlementBankCode: updatedData.settlementBankCode,
                settlementAccountNumber: updatedData.settlementAccountNumber,
            });
            updatedData.paystackSubaccountCode =
                subaccount.subaccount_code;
            updatedData.paystackAccountName =
                subaccount.account_name;
            if (!data.settlementBankName) {
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
exports.updateSchoolPaymentConfig = updateSchoolPaymentConfig;
const disableSchoolPaymentConfig = async (schoolId) => {
    validateSchoolId(schoolId);
    const config = await school_payment_config_model_1.SchoolPaymentConfig.findOneAndUpdate({
        schoolId,
    }, {
        $set: {
            isEnabled: false,
        },
    }, {
        new: true,
    });
    if (!config) {
        throw new Error('Payment configuration not found');
    }
    return config;
};
exports.disableSchoolPaymentConfig = disableSchoolPaymentConfig;
