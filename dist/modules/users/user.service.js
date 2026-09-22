"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.getUserByEmail = exports.getUserById = exports.createUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongoose_1 = require("mongoose");
const user_model_1 = require("./user.model");
const createUser = async (schoolId, data) => {
    if (!mongoose_1.Types.ObjectId.isValid(schoolId)) {
        throw new Error('Invalid school ID');
    }
    if (data.role === user_model_1.UserRole.SUPER_ADMIN) {
        throw new Error('SUPER_ADMIN cannot be created through the school user service');
    }
    const email = data.email
        .toLowerCase()
        .trim();
    const existingUser = await user_model_1.User.findOne({
        schoolId,
        email,
    });
    if (existingUser) {
        throw new Error('A user with this email already exists in this school');
    }
    const passwordHash = await bcryptjs_1.default.hash(data.password, 12);
    const user = await user_model_1.User.create({
        name: data.name.trim(),
        email,
        passwordHash,
        role: data.role,
        schoolId: new mongoose_1.Types.ObjectId(schoolId),
    });
    return user;
};
exports.createUser = createUser;
const getUserById = async (userId, schoolId) => {
    if (!mongoose_1.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid user ID');
    }
    if (!mongoose_1.Types.ObjectId.isValid(schoolId)) {
        throw new Error('Invalid school ID');
    }
    const user = await user_model_1.User.findOne({
        _id: userId,
        schoolId,
    });
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};
exports.getUserById = getUserById;
const getUserByEmail = async (email, schoolId) => {
    if (!mongoose_1.Types.ObjectId.isValid(schoolId)) {
        throw new Error('Invalid school ID');
    }
    const user = await user_model_1.User.findOne({
        email: email.toLowerCase().trim(),
        schoolId,
    }).select('+passwordHash');
    return user;
};
exports.getUserByEmail = getUserByEmail;
const updateUser = async (userId, schoolId, data) => {
    if (!mongoose_1.Types.ObjectId.isValid(userId)) {
        throw new Error('Invalid user ID');
    }
    if (!mongoose_1.Types.ObjectId.isValid(schoolId)) {
        throw new Error('Invalid school ID');
    }
    if (data.role === user_model_1.UserRole.SUPER_ADMIN) {
        throw new Error('A school user cannot be promoted to SUPER_ADMIN');
    }
    const updateData = {
        ...data,
        ...(data.email
            ? {
                email: data.email
                    .toLowerCase()
                    .trim(),
            }
            : {}),
    };
    const user = await user_model_1.User.findOneAndUpdate({
        _id: userId,
        schoolId,
    }, {
        $set: updateData,
    }, {
        new: true,
        runValidators: true,
    });
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};
exports.updateUser = updateUser;
