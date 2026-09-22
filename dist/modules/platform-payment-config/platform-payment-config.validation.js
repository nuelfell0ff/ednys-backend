"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePlatformPaymentConfigSchema = exports.createPlatformPaymentConfigSchema = void 0;
const zod_1 = require("zod");
const percentageSchema = zod_1.z
    .number()
    .min(0, 'Platform fee percentage cannot be negative')
    .max(100, 'Platform fee percentage cannot exceed 100');
const fixedFeeSchema = zod_1.z
    .number()
    .min(0, 'Platform fixed fee cannot be negative');
exports.createPlatformPaymentConfigSchema = zod_1.z.object({
    platformFeePercentage: percentageSchema.optional(),
    platformFeeFixed: fixedFeeSchema.optional(),
    isEnabled: zod_1.z.boolean().optional(),
});
exports.updatePlatformPaymentConfigSchema = exports.createPlatformPaymentConfigSchema
    .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required for an update',
});
