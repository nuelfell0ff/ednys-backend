"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = require("../config/database");
const user_model_1 = require("../modules/users/user.model");
dotenv_1.default.config();
const createSuperAdmin = async () => {
    const name = process.env.SUPER_ADMIN_NAME;
    const email = process.env.SUPER_ADMIN_EMAIL
        ?.toLowerCase()
        .trim();
    const password = process.env.SUPER_ADMIN_PASSWORD;
    if (!name || !email || !password) {
        throw new Error('SUPER_ADMIN_NAME, SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD must be defined');
    }
    if (password.length < 8) {
        throw new Error('SUPER_ADMIN_PASSWORD must be at least 8 characters');
    }
    await (0, database_1.connectDatabase)();
    const existingUser = await user_model_1.User.findOne({ email });
    if (existingUser) {
        if (existingUser.role ===
            user_model_1.UserRole.SUPER_ADMIN) {
            console.log('Super Admin already exists.');
        }
        else {
            console.log('A user with this email already exists.');
        }
        process.exit(0);
    }
    const passwordHash = await bcryptjs_1.default.hash(password, 12);
    const superAdmin = await user_model_1.User.create({
        name: name.trim(),
        email,
        passwordHash,
        role: user_model_1.UserRole.SUPER_ADMIN,
        isActive: true,
    });
    console.log(`Super Admin created: ${superAdmin.email}`);
    process.exit(0);
};
void createSuperAdmin();
