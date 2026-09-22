"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const parentstudent_controller_1 = require("./parentstudent.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const role_middleware_1 = require("../../middleware/role.middleware");
const user_model_1 = require("../users/user.model");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
/*
 * Parent-specific route
 *
 * The authenticated user's userId is used to
 * resolve their Parent profile.
 *
 * Parents cannot provide another parentId
 * through the URL.
 */
router.get('/my/students', (0, role_middleware_1.requireRole)(user_model_1.UserRole.PARENT), parentstudent_controller_1.getMyStudentsController);
/*
 * Administrative relationship management
 */
router.post('/', (0, role_middleware_1.requireRole)(user_model_1.UserRole.ADMIN), parentstudent_controller_1.createParentStudentController);
router.get('/', (0, role_middleware_1.requireRole)(user_model_1.UserRole.ADMIN), parentstudent_controller_1.getParentStudentsController);
router.get('/:id', (0, role_middleware_1.requireRole)(user_model_1.UserRole.ADMIN), parentstudent_controller_1.getParentStudentController);
router.patch('/:id', (0, role_middleware_1.requireRole)(user_model_1.UserRole.ADMIN), parentstudent_controller_1.updateParentStudentController);
router.delete('/:id', (0, role_middleware_1.requireRole)(user_model_1.UserRole.ADMIN), parentstudent_controller_1.deleteParentStudentController);
exports.default = router;
