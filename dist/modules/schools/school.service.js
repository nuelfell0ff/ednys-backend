"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSchool = exports.getSchoolById = exports.createSchool = void 0;
const school_model_1 = require("./school.model");
const createSchool = async (data) => {
    const existingSchoolBySlug = await school_model_1.School.findOne({
        slug: data.slug,
    });
    if (existingSchoolBySlug) {
        throw new Error('A school with this slug already exists');
    }
    const existingSchoolBySubdomain = await school_model_1.School.findOne({
        subdomain: data.subdomain,
    });
    if (existingSchoolBySubdomain) {
        throw new Error('A school with this subdomain already exists');
    }
    const school = await school_model_1.School.create(data);
    return school;
};
exports.createSchool = createSchool;
const getSchoolById = async (schoolId) => {
    const school = await school_model_1.School.findById(schoolId);
    if (!school) {
        throw new Error('School not found');
    }
    return school;
};
exports.getSchoolById = getSchoolById;
const updateSchool = async (schoolId, data) => {
    const school = await school_model_1.School.findByIdAndUpdate(schoolId, { $set: data }, {
        new: true,
        runValidators: true,
    });
    if (!school) {
        throw new Error('School not found');
    }
    return school;
};
exports.updateSchool = updateSchool;
