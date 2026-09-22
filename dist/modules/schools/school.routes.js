"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const school_controller_1 = require("./school.controller");
const router = (0, express_1.Router)();
router.post('/', school_controller_1.createSchoolController);
router.get('/:id', school_controller_1.getSchoolController);
router.patch('/:id', school_controller_1.updateSchoolController);
exports.default = router;
