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
exports.Invoice = exports.InvoiceStatus = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const result_model_1 = require("../results/result.model");
var InvoiceStatus;
(function (InvoiceStatus) {
    InvoiceStatus["PENDING"] = "PENDING";
    InvoiceStatus["PARTIALLY_PAID"] = "PARTIALLY_PAID";
    InvoiceStatus["PAID"] = "PAID";
    InvoiceStatus["OVERDUE"] = "OVERDUE";
    InvoiceStatus["CANCELLED"] = "CANCELLED";
})(InvoiceStatus || (exports.InvoiceStatus = InvoiceStatus = {}));
const invoiceItemSchema = new mongoose_1.Schema({
    feeStructureId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'FeeStructure',
        required: true,
    },
    feeCategoryId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'FeeCategory',
        required: true,
    },
    feeCategoryName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    dueDate: {
        type: Date,
    },
    isMandatory: {
        type: Boolean,
        default: true,
    },
}, {
    _id: false,
});
const invoiceSchema = new mongoose_1.Schema({
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
    classId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Class',
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
        enum: Object.values(result_model_1.ResultTerm),
        required: true,
        index: true,
    },
    invoiceNumber: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50,
    },
    items: {
        type: [invoiceItemSchema],
        required: true,
        validate: {
            validator: (value) => value.length > 0,
            message: 'Invoice must contain at least one fee item',
        },
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    amountPaid: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
    },
    balance: {
        type: Number,
        required: true,
        min: 0,
    },
    status: {
        type: String,
        enum: Object.values(InvoiceStatus),
        required: true,
        default: InvoiceStatus.PENDING,
        index: true,
    },
    issuedAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
}, {
    timestamps: true,
});
invoiceSchema.index({
    schoolId: 1,
    invoiceNumber: 1,
}, {
    unique: true,
});
invoiceSchema.index({
    schoolId: 1,
    studentId: 1,
    academicSessionId: 1,
    term: 1,
});
exports.Invoice = mongoose_1.default.model('Invoice', invoiceSchema);
