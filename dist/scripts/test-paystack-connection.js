"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const paystack_service_1 = require("../services/paystack.service");
dotenv_1.default.config();
const testPaystackConnection = async () => {
    try {
        await (0, paystack_service_1.verifyPaystackConnection)();
        console.log('Paystack connection successful.');
        process.exit(0);
    }
    catch (error) {
        console.error('Paystack connection failed:', error);
        process.exit(1);
    }
};
void testPaystackConnection();
