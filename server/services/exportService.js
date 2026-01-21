const exceljs = require('exceljs');

exports.generateLeadsExcel = async (leads, res) => {
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Leads');

    worksheet.columns = [
        { header: 'ID', key: 'id', width: 30 },
        { header: 'Full Name', key: 'fullName', width: 25 },
        { header: 'Mobile', key: 'mobile', width: 15 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'City', key: 'city', width: 20 },
        { header: 'Income Range', key: 'income', width: 20 },
        { header: 'Date', key: 'createdAt', width: 25 }
    ];

    leads.forEach(lead => {
        worksheet.addRow({
            ...lead,
            createdAt: lead.createdAt.toLocaleString()
        });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=leads.xlsx');

    await workbook.xlsx.write(res);
    res.end();
};
