
const Excel = require('exceljs');
const { rootDirectory } = require('../directory');
const path = require("path")
const wb = new Excel.Workbook();


module.exports = async function generateExcel(columns, data, fileName = `excel-${Date.now()}.xlsx`, directory = path.join(rootDirectory, "public", "file", "upload")) {
    const ws = wb.addWorksheet(fileName);
    ws.columns = columns.map((c) => {
        const header = c.split("_").map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(" ")
        return {
            header,
            key: c
        }
    })

    ws.getRow(1).font = { bold: true }


    data.forEach((d) => {
        ws.addRow(d)
    })
    try {
        await wb.xlsx.writeFile(path.join(directory, fileName))
        return {
            error: null,
            fileName,
        }
    } catch (error) {
        return {
            error,
            fileName: null
        }
    }

}
