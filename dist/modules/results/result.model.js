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
exports.Result = exports.ResultStatus = exports.ResultTerm = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var ResultTerm;
(function (ResultTerm) {
    ResultTerm["FIRST_TERM"] = "FIRST_TERM";
    ResultTerm["SECOND_TERM"] = "SECOND_TERM";
    ResultTerm["THIRD_TERM"] = "THIRD_TERM";
})(ResultTerm || (exports.ResultTerm = ResultTerm = {}));
var ResultStatus;
(function (ResultStatus) {
    ResultStatus["DRAFT"] = "DRAFT";
    ResultStatus["PUBLISHED"] = "PUBLISHED";
})(ResultStatus || (exports.ResultStatus = ResultStatus = {}));
const resultSchema = new mongoose_1.Schema({
    schoolId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'School',
        required: true,
        index: true,
    },
    studentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
        index: true,
    },
    teacherId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true,
        index: true,
    },
    classId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Class',
        required: true,
        index: true,
    },
    subjectId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true,
        index: true,
    },
    academicSessionId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'AcademicSession',
        required: true,
        index: true,
    },
    term: {
        type: String,
        enum: Object.values(ResultTerm),
        required: true,
        index: true,
    },
    firstCA: {
        type: Number,
        min: 0,
        max: 20,
    },
    secondCA: {
        type: Number,
        min: 0,
        max: 20,
    },
    exam: {
        type: Number,
        min: 0,
        max: 60,
    },
    total: {
        type: Number,
        min: 0,
        max: 100,
    },
    grade: {
        type: String,
        trim: true,
        maxlength: 5,
    },
    remark: {
        type: String,
        trim: true,
        maxlength: 100,
    },
    status: {
        type: String,
        enum: Object.values(ResultStatus),
        default: ResultStatus.DRAFT,
        index: true,
    },
}, {
    timestamps: true,
});
resultSchema.index({
    schoolId: 1,
    studentId: 1,
    subjectId: 1,
    academicSessionId: 1,
    term: 1,
}, {
    unique: true,
});
resultSchema.index({
    schoolId: 1,
    classId: 1,
    subjectId: 1,
    academicSessionId: 1,
    term: 1,
});
exports.Result = mongoose_1.default.model('Result', resultSchema);
