"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSchoolPaymentConfigSchema = exports.createSchoolPaymentConfigSchema = void 0;
const zod_1 = require("zod");
exports.createSchoolPaymentConfigSchema = zod_1.z.object({
    paystackSubaccountCode: zod_1.z
        .string()
        .trim()
        .max(100, 'Paystack subaccount code cannot exceed 100 characters')
        .optional(),
    paystackAccountName: zod_1.z
        .string()
        .trim()
        .max(150, 'Paystack account name cannot exceed 150 characters')
        .optional(),
    settlementBankCode: zod_1.z
        .string()
        .trim()
        .max(20, 'Settlement bank code cannot exceed 20 characters')
        .optional(),
    settlementBankName: zod_1.z
        .string()
        .trim()
        .max(100, 'Settlement bank name cannot exceed 100 characters')
        .optional(),
    settlementAccountNumber: zod_1.z
        .string()
        .trim()
        .max(30, 'Settlement account number cannot exceed 30 characters')
        .optional(),
    isEnabled: zod_1.z.boolean().optional(),
});
exports.updateSchoolPaymentConfigSchema = exports.createSchoolPaymentConfigSchema
    .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required for an update',
});
