"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Student = exports.StudentGender = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var StudentGender;
(function (StudentGender) {
    StudentGender["MALE"] = "MALE";
    StudentGender["FEMALE"] = "FEMALE";
})(StudentGender || (exports.StudentGender = StudentGender = {}));
const studentSchema = new mongoose_1.Schema({
    schoolId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'School',
        required: true,
        index: true,
    },
    admissionNumber: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
        maxlength: 50,
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
    },
    middleName: {
        type: String,
        trim: true,
        maxlength: 100,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
    },
    dateOfBirth: {
        type: Date,
    },
    gender: {
        type: String,
        enum: Object.values(StudentGender),
    },
    classId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Class',
        index: true,
    },
    academicSessionId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'AcademicSession',
        index: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
studentSchema.index({
    schoolId: 1,
    admissionNumber: 1,
}, {
    unique: true,
});
exports.Student = mongoose_1.default.model('Student', studentSchema);
