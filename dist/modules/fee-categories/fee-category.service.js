"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFeeCategory = exports.updateFeeCategory = exports.getFeeCategoryById = exports.getFeeCategories = exports.createFeeCategory = void 0;
const mongoose_1 = require("mongoose");
const fee_category_model_1 = require("./fee-category.model");
const validateSchoolId = (schoolId) => {
    if (!mongoose_1.Types.ObjectId.isValid(schoolId)) {
        throw new Error('Invalid school ID');
    }
};
const validateFeeCategoryId = (feeCategoryId) => {
    if (!mongoose_1.Types.ObjectId.isValid(feeCategoryId)) {
        throw new Error('Invalid fee category ID');
    }
};
const normalizeOptionalString = (value) => {
    const normalized = value?.trim();
    return normalized || undefined;
};
const createFeeCategory = async (schoolId, data) => {
    validateSchoolId(schoolId);
    const name = data.name.trim();
    const existingCategory = await fee_category_model_1.FeeCategory.findOne({
        schoolId,
        name: {
            $regex: `^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`,
            $options: 'i',
        },
    });
    if (existingCategory) {
        throw new Error('A fee category with this name already exists');
    }
    const feeCategory = await fee_category_model_1.FeeCategory.create({
        schoolId: new mongoose_1.Types.ObjectId(schoolId),
        name,
        description: normalizeOptionalString(data.description),
    });
    return feeCategory;
};
exports.createFeeCategory = createFeeCategory;
const getFeeCategories = async (schoolId) => {
    validateSchoolId(schoolId);
    const feeCategories = await fee_category_model_1.FeeCategory.find({
        schoolId,
        isActive: true,
    }).sort({
        name: 1,
    });
    return feeCategories;
};
exports.getFeeCategories = getFeeCategories;
const getFeeCategoryById = async (feeCategoryId, schoolId) => {
    validateFeeCategoryId(feeCategoryId);
    validateSchoolId(schoolId);
    const feeCategory = await fee_category_model_1.FeeCategory.findOne({
        _id: feeCategoryId,
        schoolId,
    });
    if (!feeCategory) {
        throw new Error('Fee category not found');
    }
    return feeCategory;
};
exports.getFeeCategoryById = getFeeCategoryById;
const updateFeeCategory = async (feeCategoryId, schoolId, data) => {
    validateFeeCategoryId(feeCategoryId);
    validateSchoolId(schoolId);
    const existingCategory = await fee_category_model_1.FeeCategory.findOne({
        _id: feeCategoryId,
        schoolId,
    });
    if (!existingCategory) {
        throw new Error('Fee category not found');
    }
    const updateData = {};
    if (data.name !== undefined) {
        const name = data.name.trim();
        const duplicateCategory = await fee_category_model_1.FeeCategory.findOne({
            schoolId,
            _id: {
                $ne: feeCategoryId,
            },
            name: {
                $regex: `^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`,
                $options: 'i',
            },
        });
        if (duplicateCategory) {
            throw new Error('A fee category with this name already exists');
        }
        updateData.name = name;
    }
    if (data.description !== undefined) {
        updateData.description =
            normalizeOptionalString(data.description);
    }
    if (data.isActive !== undefined) {
        updateData.isActive =
            data.isActive;
    }
    const feeCategory = await fee_category_model_1.FeeCategory.findOneAndUpdate({
        _id: feeCategoryId,
        schoolId,
    }, {
        $set: updateData,
    }, {
        new: true,
        runValidators: true,
    });
    if (!feeCategory) {
        throw new Error('Fee category not found');
    }
    return feeCategory;
};
exports.updateFeeCategory = updateFeeCategory;
const deleteFeeCategory = async (feeCategoryId, schoolId) => {
    validateFeeCategoryId(feeCategoryId);
    validateSchoolId(schoolId);
    const feeCategory = await fee_category_model_1.FeeCategory.findOneAndUpdate({
        _id: feeCategoryId,
        schoolId,
    }, {
        $set: {
            isActive: false,
        },
    }, {
        new: true,
    });
    if (!feeCategory) {
        throw new Error('Fee category not found');
    }
    return feeCategory;
};
exports.deleteFeeCategory = deleteFeeCategory;
