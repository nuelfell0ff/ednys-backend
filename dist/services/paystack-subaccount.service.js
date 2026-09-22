"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaystackSubaccount = void 0;
const paystack_1 = require("../config/paystack");
const createPaystackSubaccount = async (data) => {
    const response = await paystack_1.paystackClient.post('/subaccount', {
        business_name: data.businessName,
        bank_code: data.bankCode,
        account_number: data.accountNumber,
        percentage_charge: data.percentageCharge,
        description: data.description,
        primary_contact_email: data.primaryContactEmail,
        primary_contact_name: data.primaryContactName,
        primary_contact_phone: data.primaryContactPhone,
    });
    return response.data;
};
exports.createPaystackSubaccount = createPaystackSubaccount;
