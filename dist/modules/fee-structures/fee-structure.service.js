"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFeeStructure = exports.updateFeeStructure = exports.getFeeStructureById = exports.getFeeStructures = exports.createFeeStructure = void 0;
const mongoose_1 = require("mongoose");
const fee_structure_model_1 = require("./fee-structure.model");
const academic_session_model_1 = require("../academic-sessions/academic-session.model");
const class_model_1 = require("../classes/class.model");
const fee_category_model_1 = require("../fee-categories/fee-category.model");
const validateSchoolId = (schoolId) => {
    if (!mongoose_1.Types.ObjectId.isValid(schoolId)) {
        throw new Error('Invalid school ID');
    }
};
const validateId = (id, fieldName) => {
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        throw new Error(`Invalid ${fieldName}`);
    }
};
const normalizeDate = (value) => {
    if (value === undefined) {
        return undefined;
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        throw new Error('Invalid date');
    }
    return date;
};
const createFeeStructure = async (schoolId, data) => {
    validateSchoolId(schoolId);
    validateId(data.academicSessionId, 'academic session ID');
    validateId(data.classId, 'class ID');
    validateId(data.feeCategoryId, 'fee category ID');
    const academicSession = await academic_session_model_1.AcademicSession.findOne({
        _id: data.academicSessionId,
        schoolId,
    });
    if (!academicSession) {
        throw new Error('Academic session not found');
    }
    const schoolClass = await class_model_1.Class.findOne({
        _id: data.classId,
        schoolId,
    });
    if (!schoolClass) {
        throw new Error('Class not found');
    }
    const feeCategory = await fee_category_model_1.FeeCategory.findOne({
        _id: data.feeCategoryId,
        schoolId,
        isActive: true,
    });
    if (!feeCategory) {
        throw new Error('Active fee category not found');
    }
    const existingStructure = await fee_structure_model_1.FeeStructure.findOne({
        schoolId,
        academicSessionId: data.academicSessionId,
        term: data.term,
        classId: data.classId,
        feeCategoryId: data.feeCategoryId,
    });
    if (existingStructure) {
        throw new Error('A fee structure already exists for this class, term, session and fee category');
    }
    const dueDate = normalizeDate(data.dueDate);
    const feeStructure = await fee_structure_model_1.FeeStructure.create({
        schoolId: new mongoose_1.Types.ObjectId(schoolId),
        academicSessionId: new mongoose_1.Types.ObjectId(data.academicSessionId),
        term: data.term,
        classId: new mongoose_1.Types.ObjectId(data.classId),
        feeCategoryId: new mongoose_1.Types.ObjectId(data.feeCategoryId),
        amount: data.amount,
        dueDate,
        isMandatory: data.isMandatory ?? true,
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
exports.createFeeStructure = createFeeStructure;
const getFeeStructures = async (schoolId) => {
    validateSchoolId(schoolId);
    const feeStructures = await fee_structure_model_1.FeeStructure.find({
        schoolId,
        isActive: true,
    })
        .populate({
        path: 'academicSessionId',
        select: 'name startDate endDate isActive',
    })
        .populate({
        path: 'classId',
        select: 'name',
    })
        .populate({
        path: 'feeCategoryId',
        select: 'name description isActive',
    })
        .sort({
        academicSessionId: 1,
        term: 1,
        createdAt: -1,
    });
    return feeStructures;
};
exports.getFeeStructures = getFeeStructures;
const getFeeStructureById = async (feeStructureId, schoolId) => {
    validateId(feeStructureId, 'fee structure ID');
    validateSchoolId(schoolId);
    const feeStructure = await fee_structure_model_1.FeeStructure.findOne({
        _id: feeStructureId,
        schoolId,
    })
        .populate({
        path: 'academicSessionId',
        select: 'name startDate endDate isActive',
    })
        .populate({
        path: 'classId',
        select: 'name',
    })
        .populate({
        path: 'feeCategoryId',
        select: 'name description isActive',
    });
    if (!feeStructure) {
        throw new Error('Fee structure not found');
    }
    return feeStructure;
};
exports.getFeeStructureById = getFeeStructureById;
const updateFeeStructure = async (feeStructureId, schoolId, data) => {
    validateId(feeStructureId, 'fee structure ID');
    validateSchoolId(schoolId);
    const existingStructure = await fee_structure_model_1.FeeStructure.findOne({
        _id: feeStructureId,
        schoolId,
    });
    if (!existingStructure) {
        throw new Error('Fee structure not found');
    }
    const academicSessionId = data.academicSessionId ??
        existingStructure.academicSessionId.toString();
    const term = data.term ??
        existingStructure.term;
    const classId = data.classId ??
        existingStructure.classId.toString();
    const feeCategoryId = data.feeCategoryId ??
        existingStructure.feeCategoryId.toString();
    validateId(academicSessionId, 'academic session ID');
    validateId(classId, 'class ID');
    validateId(feeCategoryId, 'fee category ID');
    if (data.academicSessionId !==
        undefined) {
        const academicSession = await academic_session_model_1.AcademicSession.findOne({
            _id: data.academicSessionId,
            schoolId,
        });
        if (!academicSession) {
            throw new Error('Academic session not found');
        }
    }
    if (data.classId !== undefined) {
        const schoolClass = await class_model_1.Class.findOne({
            _id: data.classId,
            schoolId,
        });
        if (!schoolClass) {
            throw new Error('Class not found');
        }
    }
    if (data.feeCategoryId !==
        undefined) {
        const feeCategory = await fee_category_model_1.FeeCategory.findOne({
            _id: data.feeCategoryId,
            schoolId,
            isActive: true,
        });
        if (!feeCategory) {
            throw new Error('Active fee category not found');
        }
    }
    const duplicateStructure = await fee_structure_model_1.FeeStructure.findOne({
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
        throw new Error('A fee structure already exists for this class, term, session and fee category');
    }
    const updateData = {};
    if (data.academicSessionId !==
        undefined) {
        updateData.academicSessionId =
            new mongoose_1.Types.ObjectId(data.academicSessionId);
    }
    if (data.term !== undefined) {
        updateData.term = data.term;
    }
    if (data.classId !== undefined) {
        updateData.classId =
            new mongoose_1.Types.ObjectId(data.classId);
    }
    if (data.feeCategoryId !==
        undefined) {
        updateData.feeCategoryId =
            new mongoose_1.Types.ObjectId(data.feeCategoryId);
    }
    if (data.amount !== undefined) {
        updateData.amount = data.amount;
    }
    if (data.dueDate !== undefined) {
        updateData.dueDate =
            normalizeDate(data.dueDate);
    }
    if (data.isMandatory !== undefined) {
        updateData.isMandatory =
            data.isMandatory;
    }
    if (data.isActive !== undefined) {
        updateData.isActive =
            data.isActive;
    }
    const feeStructure = await fee_structure_model_1.FeeStructure.findOneAndUpdate({
        _id: feeStructureId,
        schoolId,
    }, {
        $set: updateData,
    }, {
        new: true,
        runValidators: true,
    })
        .populate({
        path: 'academicSessionId',
        select: 'name startDate endDate isActive',
    })
        .populate({
        path: 'classId',
        select: 'name',
    })
        .populate({
        path: 'feeCategoryId',
        select: 'name description isActive',
    });
    if (!feeStructure) {
        throw new Error('Fee structure not found');
    }
    return feeStructure;
};
exports.updateFeeStructure = updateFeeStructure;
const deleteFeeStructure = async (feeStructureId, schoolId) => {
    validateId(feeStructureId, 'fee structure ID');
    validateSchoolId(schoolId);
    const feeStructure = await fee_structure_model_1.FeeStructure.findOneAndUpdate({
        _id: feeStructureId,
        schoolId,
    }, {
        $set: {
            isActive: false,
        },
    }, {
        new: true,
    })
        .populate({
        path: 'academicSessionId',
        select: 'name startDate endDate isActive',
    })
        .populate({
        path: 'classId',
        select: 'name',
    })
        .populate({
        path: 'feeCategoryId',
        select: 'name description isActive',
    });
    if (!feeStructure) {
        throw new Error('Fee structure not found');
    }
    return feeStructure;
};
exports.deleteFeeStructure = deleteFeeStructure;
