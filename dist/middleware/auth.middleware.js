"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const school_model_1 = require("../modules/schools/school.model");
const user_model_1 = require("../modules/users/user.model");
const authenticate = async (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    const [scheme, token] = authorization.split(' ');
    if (scheme !== 'Bearer' ||
        !token) {
        res.status(401).json({
            success: false,
            message: 'Invalid authorization format',
        });
        return;
    }
    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) {
        res.status(500).json({
            success: false,
            message: 'Authentication configuration error',
        });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        if (!decoded.userId ||
            !decoded.role) {
            res.status(401).json({
                success: false,
                message: 'Invalid authentication token',
            });
            return;
        }
        if (!Object.values(user_model_1.UserRole).includes(decoded.role)) {
            res.status(401).json({
                success: false,
                message: 'Invalid user role',
            });
            return;
        }
        if (decoded.role ===
            user_model_1.UserRole.SUPER_ADMIN) {
            if (decoded.schoolId) {
                res.status(401).json({
                    success: false,
                    message: 'Invalid SUPER_ADMIN authentication token',
                });
                return;
            }
            const user = await user_model_1.User.findOne({
                _id: decoded.userId,
                role: user_model_1.UserRole.SUPER_ADMIN,
                isActive: true,
            });
            if (!user) {
                res.status(401).json({
                    success: false,
                    message: 'Super Admin account is inactive or unavailable',
                });
                return;
            }
            req.user = {
                userId: user._id.toString(),
                role: user_model_1.UserRole.SUPER_ADMIN,
            };
            next();
            return;
        }
        if (!decoded.schoolId) {
            res.status(401).json({
                success: false,
                message: 'Invalid authentication token',
            });
            return;
        }
        const user = await user_model_1.User.findOne({
            _id: decoded.userId,
            schoolId: decoded.schoolId,
            isActive: true,
        });
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'User account is inactive or unavailable',
            });
            return;
        }
        if (user.role ===
            user_model_1.UserRole.SUPER_ADMIN) {
            res.status(401).json({
                success: false,
                message: 'Invalid school user authentication',
            });
            return;
        }
        const school = await school_model_1.School.findOne({
            _id: decoded.schoolId,
            isActive: true,
        });
        if (!school) {
            res.status(401).json({
                success: false,
                message: 'School account is inactive or unavailable',
            });
            return;
        }
        req.user = {
            userId: user._id.toString(),
            schoolId: school._id.toString(),
            role: user.role,
        };
        next();
    }
    catch {
        res.status(401).json({
            success: false,
            message: 'Invalid or expired authentication token',
        });
    }
};
exports.authenticate = authenticate;
