const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const ExcelJS = require('exceljs');
const exportService = require('../services/exportService');

exports.getAllLeads = async (req, res) => {
    try {
        const leads = await prisma.lead.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(leads);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching leads', error: error.message });
    }
};

exports.submitLead = async (req, res) => {
    const { fullName, mobile, email, city, income, consent, calculatorData } = req.body;
    try {
        const leadData = {
            fullName,
            mobile,
            email,
            city,
            income,
            consent
        };

        // If context data exists, link it
        if (calculatorData) {
            leadData.calculatorEntries = {
                create: {
                    type: calculatorData.type,
                    inputData: calculatorData.inputData,
                    resultData: calculatorData.resultData
                }
            };
        }

        const lead = await prisma.lead.create({
            data: leadData
        });
        res.status(201).json({ success: true, message: 'Lead submitted successfully', leadId: lead.id });
    } catch (err) {
        console.error('Lead Submission Error:', err);
        res.status(400).json({ success: false, message: 'Error submitting lead', error: err.message });
    }
};

exports.exportLeads = async (req, res) => {
    try {
        const leads = await prisma.lead.findMany({
            orderBy: { createdAt: 'desc' }
        });

        await exportService.generateLeadsExcel(leads, res);

    } catch (err) {
        console.error('Export Error:', err);
        res.status(500).json({ message: 'Error exporting leads', error: err.message });
    }
};
