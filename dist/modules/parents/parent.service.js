"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateParent = exports.getMyParentDashboard = exports.getMyParentProfile = exports.getParentByUserId = exports.getParentById = exports.getParents = exports.createParent = void 0;
const mongoose_1 = require("mongoose");
const parent_model_1 = require("./parent.model");
const user_model_1 = require("../users/user.model");
const parentstudent_model_1 = require("../ParentStudent/parentstudent.model");
const student_model_1 = require("../students/student.model");
const result_model_1 = require("../results/result.model");
const validateObjectId = (value, message) => {
    if (!mongoose_1.Types.ObjectId.isValid(value)) {
        throw new Error(message);
    }
};
const validateSchoolId = (schoolId) => {
    validateObjectId(schoolId, 'Invalid school ID');
};
const getParentUser = async (userId, schoolId) => {
    validateObjectId(userId, 'Invalid user ID');
    validateSchoolId(schoolId);
    const user = await user_model_1.User.findOne({
        _id: userId,
        schoolId,
        role: user_model_1.UserRole.PARENT,
        isActive: true,
    });
    if (!user) {
        throw new Error('Active parent user not found');
    }
    return user;
};
const createParent = async (schoolId, data) => {
    validateSchoolId(schoolId);
    const user = await getParentUser(data.userId, schoolId);
    const existingParent = await parent_model_1.Parent.findOne({
        schoolId,
        userId: user._id,
    });
    if (existingParent) {
        throw new Error('A parent profile already exists for this user');
    }
    const parent = await parent_model_1.Parent.create({
        userId: user._id,
        schoolId,
        phone: data.phone?.trim(),
        address: data.address?.trim(),
        occupation: data.occupation?.trim(),
        isActive: true,
    });
    return parent;
};
exports.createParent = createParent;
const getParents = async (schoolId) => {
    validateSchoolId(schoolId);
    const parents = await parent_model_1.Parent.find({
        schoolId,
    })
        .populate({
        path: 'userId',
        select: 'name email role isActive',
    })
        .sort({
        createdAt: -1,
    });
    return parents;
};
exports.getParents = getParents;
const getParentById = async (schoolId, parentId) => {
    validateSchoolId(schoolId);
    validateObjectId(parentId, 'Invalid parent ID');
    const parent = await parent_model_1.Parent.findOne({
        _id: parentId,
        schoolId,
    }).populate({
        path: 'userId',
        select: 'name email role isActive',
    });
    if (!parent) {
        throw new Error('Parent not found');
    }
    return parent;
};
exports.getParentById = getParentById;
const getParentByUserId = async (schoolId, userId) => {
    validateSchoolId(schoolId);
    validateObjectId(userId, 'Invalid user ID');
    const parent = await parent_model_1.Parent.findOne({
        schoolId,
        userId,
    }).populate({
        path: 'userId',
        select: 'name email role isActive',
    });
    if (!parent) {
        throw new Error('Parent profile not found');
    }
    return parent;
};
exports.getParentByUserId = getParentByUserId;
const getMyParentProfile = async (schoolId, userId) => {
    validateSchoolId(schoolId);
    validateObjectId(userId, 'Invalid user ID');
    const parent = await parent_model_1.Parent.findOne({
        schoolId,
        userId,
        isActive: true,
    }).populate({
        path: 'userId',
        select: 'name email role isActive',
    });
    if (!parent) {
        throw new Error('Active parent profile not found for this user');
    }
    return parent;
};
exports.getMyParentProfile = getMyParentProfile;
const getMyParentDashboard = async (schoolId, userId) => {
    validateSchoolId(schoolId);
    validateObjectId(userId, 'Invalid user ID');
    const parent = await parent_model_1.Parent.findOne({
        schoolId,
        userId,
        isActive: true,
    }).populate({
        path: 'userId',
        select: 'name email role isActive',
    });
    if (!parent) {
        throw new Error('Active parent profile not found for this user');
    }
    const relationships = await parentstudent_model_1.ParentStudent.find({
        schoolId,
        parentId: parent._id,
        isActive: true,
    }).select('studentId relationship');
    const studentIds = relationships.map((relationship) => relationship.studentId);
    let children = [];
    let results = [];
    if (studentIds.length > 0) {
        children =
            await student_model_1.Student.find({
                _id: {
                    $in: studentIds,
                },
                schoolId,
                isActive: true,
            })
                .select('admissionNumber firstName middleName lastName dateOfBirth gender classId academicSessionId isActive')
                .populate({
                path: 'classId',
                select: 'name code level capacity isActive',
            })
                .populate({
                path: 'academicSessionId',
                select: 'name startDate endDate isActive',
            })
                .sort({
                createdAt: -1,
            });
        results =
            await result_model_1.Result.find({
                schoolId,
                studentId: {
                    $in: studentIds,
                },
                status: result_model_1.ResultStatus.PUBLISHED,
            })
                .populate({
                path: 'studentId',
                select: 'firstName middleName lastName admissionNumber gender',
            })
                .populate({
                path: 'classId',
                select: 'name code level capacity isActive',
            })
                .populate({
                path: 'subjectId',
                select: 'name isActive',
            })
                .populate({
                path: 'academicSessionId',
                select: 'name startDate endDate isActive',
            })
                .sort({
                createdAt: -1,
            });
    }
    return {
        profile: parent,
        children,
        results,
    };
};
exports.getMyParentDashboard = getMyParentDashboard;
const updateParent = async (schoolId, parentId, data) => {
    validateSchoolId(schoolId);
    validateObjectId(parentId, 'Invalid parent ID');
    const parent = await parent_model_1.Parent.findOne({
        _id: parentId,
        schoolId,
    });
    if (!parent) {
        throw new Error('Parent not found');
    }
    if (data.phone !== undefined) {
        parent.phone =
            data.phone.trim();
    }
    if (data.address !== undefined) {
        parent.address =
            data.address.trim();
    }
    if (data.occupation !== undefined) {
        parent.occupation =
            data.occupation.trim();
    }
    if (data.isActive !== undefined) {
        parent.isActive =
            data.isActive;
    }
    await parent.save();
    return parent;
};
exports.updateParent = updateParent;
