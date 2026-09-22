"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelInvoiceController = exports.getInvoiceController = exports.getInvoicesController = exports.createInvoiceController = void 0;
const invoice_service_1 = require("./invoice.service");
const invoice_validation_1 = require("./invoice.validation");
const getSchoolId = (req) => {
    if (!req.user?.schoolId) {
        return null;
    }
    return req.user.schoolId;
};
const getInvoiceId = (req) => {
    const { id } = req.params;
    if (typeof id !== 'string' ||
        !id.trim()) {
        return null;
    }
    return id;
};
const createInvoiceController = async (req, res) => {
    const schoolId = getSchoolId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    const validationResult = invoice_validation_1.createInvoiceSchema.safeParse(req.body);
    if (!validationResult.success) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: validationResult.error.flatten(),
        });
        return;
    }
    try {
        const invoice = await (0, invoice_service_1.createInvoice)(schoolId, validationResult.data);
        res.status(201).json({
            success: true,
            message: 'Invoice created successfully',
            data: invoice,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to create invoice',
        });
    }
};
exports.createInvoiceController = createInvoiceController;
const getInvoicesController = async (req, res) => {
    const schoolId = getSchoolId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    const validationResult = invoice_validation_1.invoiceQuerySchema.safeParse(req.query);
    if (!validationResult.success) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: validationResult.error.flatten(),
        });
        return;
    }
    try {
        const invoices = await (0, invoice_service_1.getInvoices)(schoolId, validationResult.data);
        res.status(200).json({
            success: true,
            data: invoices,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : 'Failed to retrieve invoices',
        });
    }
};
exports.getInvoicesController = getInvoicesController;
const getInvoiceController = async (req, res) => {
    const schoolId = getSchoolId(req);
    const invoiceId = getInvoiceId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    if (!invoiceId) {
        res.status(400).json({
            success: false,
            message: 'Invoice ID is required',
        });
        return;
    }
    try {
        const invoice = await (0, invoice_service_1.getInvoiceById)(invoiceId, schoolId);
        res.status(200).json({
            success: true,
            data: invoice,
        });
    }
    catch (error) {
        const message = error instanceof Error
            ? error.message
            : 'Failed to retrieve invoice';
        res.status(message === 'Invoice not found'
            ? 404
            : 400).json({
            success: false,
            message,
        });
    }
};
exports.getInvoiceController = getInvoiceController;
const cancelInvoiceController = async (req, res) => {
    const schoolId = getSchoolId(req);
    const invoiceId = getInvoiceId(req);
    if (!schoolId) {
        res.status(401).json({
            success: false,
            message: 'Authentication required',
        });
        return;
    }
    if (!invoiceId) {
        res.status(400).json({
            success: false,
            message: 'Invoice ID is required',
        });
        return;
    }
    try {
        const invoice = await (0, invoice_service_1.cancelInvoice)(invoiceId, schoolId);
        res.status(200).json({
            success: true,
            message: 'Invoice cancelled successfully',
            data: invoice,
        });
    }
    catch (error) {
        const message = error instanceof Error
            ? error.message
            : 'Failed to cancel invoice';
        res.status(message === 'Invoice not found'
            ? 404
            : 400).json({
            success: false,
            message,
        });
    }
};
exports.cancelInvoiceController = cancelInvoiceController;
