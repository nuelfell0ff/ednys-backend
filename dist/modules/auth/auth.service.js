"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerSchoolAdmin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const school_model_1 = require("../schools/school.model");
const user_model_1 = require("../users/user.model");
const generateSchoolSlug = (schoolName) => {
    return schoolName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
};
const generateUniqueSchoolSlug = async (schoolName) => {
    const baseSlug = generateSchoolSlug(schoolName);
    let slug = baseSlug;
    let counter = 1;
    while (await school_model_1.School.exists({ slug })) {
        slug = `${baseSlug}-${counter}`;
        counter += 1;
    }
    return slug;
};
const generateAccessToken = (userId, role, schoolId) => {
    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) {
        throw new Error('JWT_ACCESS_SECRET is not defined');
    }
    const payload = {
        userId,
        role,
    };
    if (schoolId) {
        payload.schoolId = schoolId;
    }
    return jsonwebtoken_1.default.sign(payload, secret, {
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN ||
            '15m',
    });
};
const registerSchoolAdmin = async (data) => {
    const adminEmail = data.adminEmail
        .toLowerCase()
        .trim();
    const existingUser = await user_model_1.User.findOne({
        email: adminEmail,
    });
    if (existingUser) {
        throw new Error('A user with this email already exists');
    }
    const slug = await generateUniqueSchoolSlug(data.schoolName);
    const passwordHash = await bcryptjs_1.default.hash(data.adminPassword, 12);
    const school = await school_model_1.School.create({
        name: data.schoolName,
        slug,
        email: data.schoolEmail,
        phone: data.schoolPhone,
        address: data.schoolAddress,
        city: data.schoolCity,
        state: data.schoolState,
        country: 'Nigeria',
    });
    try {
        const admin = await user_model_1.User.create({
            name: data.adminName,
            email: adminEmail,
            passwordHash,
            role: user_model_1.UserRole.ADMIN,
            schoolId: school._id,
        });
        const accessToken = generateAccessToken(admin._id.toString(), admin.role, school._id.toString());
        return {
            user: {
                id: admin._id.toString(),
                name: admin.name,
                email: admin.email,
                role: admin.role,
                schoolId: school._id.toString(),
            },
            school: {
                id: school._id.toString(),
                name: school.name,
                slug: school.slug,
            },
            accessToken,
        };
    }
    catch (error) {
        await school_model_1.School.findByIdAndDelete(school._id);
        throw error;
    }
};
exports.registerSchoolAdmin = registerSchoolAdmin;
const loginUser = async (data) => {
    const email = data.email.toLowerCase().trim();
    const user = await user_model_1.User.findOne({
        email,
        isActive: true,
    }).select('+passwordHash');
    if (!user) {
        throw new Error('Invalid email or password');
    }
    const passwordMatches = await bcryptjs_1.default.compare(data.password, user.passwordHash);
    if (!passwordMatches) {
        throw new Error('Invalid email or password');
    }
    if (user.role ===
        user_model_1.UserRole.SUPER_ADMIN) {
        if (user.schoolId) {
            throw new Error('Super Admin account configuration is invalid');
        }
        const accessToken = generateAccessToken(user._id.toString(), user.role);
        return {
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
            },
            accessToken,
        };
    }
    if (!user.schoolId) {
        throw new Error('User account configuration is invalid');
    }
    const school = await school_model_1.School.findOne({
        _id: user.schoolId,
        isActive: true,
    });
    if (!school) {
        throw new Error('Your school account is inactive or unavailable');
    }
    const accessToken = generateAccessToken(user._id.toString(), user.role, school._id.toString());
    return {
        user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            schoolId: school._id.toString(),
        },
        school: {
            id: school._id.toString(),
            name: school.name,
            slug: school.slug,
        },
        accessToken,
    };
};
exports.loginUser = loginUser;
