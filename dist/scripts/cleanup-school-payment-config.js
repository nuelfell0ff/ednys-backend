"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const database_1 = require("../config/database");
dotenv_1.default.config();
const cleanupSchoolPaymentConfig = async () => {
    await (0, database_1.connectDatabase)();
    const result = await mongoose_1.default.connection
        .collection('schoolpaymentconfigs')
        .updateMany({}, {
        $unset: {
            platformFeePercentage: '',
            platformFeeFixed: '',
        },
    });
    console.log(`Cleanup completed. Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);
    await mongoose_1.default.disconnect();
};
void cleanupSchoolPaymentConfig();
