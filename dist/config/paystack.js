"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paystackClient = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config();
const secretKey = process.env.PAYSTACK_SECRET_KEY;
if (!secretKey) {
    throw new Error('PAYSTACK_SECRET_KEY is not defined');
}
exports.paystackClient = axios_1.default.create({
    baseURL: process.env.PAYSTACK_BASE_URL ||
        'https://api.paystack.co',
    headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
    },
    timeout: 30000,
});
