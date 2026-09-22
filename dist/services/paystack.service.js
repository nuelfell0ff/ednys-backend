"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPaystackConnection = void 0;
const paystack_1 = require("../config/paystack");
const verifyPaystackConnection = async () => {
    await paystack_1.paystackClient.get('/balance');
};
exports.verifyPaystackConnection = verifyPaystackConnection;
