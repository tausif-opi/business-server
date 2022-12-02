const PdfPrinter = require("pdfmake");
const { rootDirectory } = require("../directory");
const path = require("path");


const fontPath = path.join(rootDirectory, "public", "fonts")
const logoPath = path.join(rootDirectory, "public", "file", "utils", "logo.png")

const fonts = {
    Roboto: {
        normal: `${fontPath}/Roboto-Regular.ttf`,
        bold: `${fontPath}/Roboto-Medium.ttf`,
        italics: `${fontPath}/Roboto-Italic.ttf`,
        bolditalics: `${fontPath}/Roboto-MediumItalic.ttf`
    }
};

/**
 * 
 * @param {String} studentTitle 
 * @param {Number} year 
 * @param {String} examTitle 
 * @param {String} section 
 * @param {String} group 
 * @param {Array} tableData 
 * @returns Object {content: Array, styles: Object}
 */

const docDefinition = (studentTitle, year, examTitle, section, group, tableData = []) => {

    const definition = {
        content: [
            {
                text: "College Name",
                style: "header"
            },
            {
                text: studentTitle,
                margin: [0, 8, 0, 0],


            },
            {
                text: `${year} year, ${examTitle}`,
                bold: true
            },
            {
                text: section
            },
            {
                text: group
            },
            {
                style: "dataTable",
                table: {
                    headerRows: 1,
                    widths: [100, 100, 100, 100],

                    body: [
                        [{text: 'Subject', bold: true}, {text: 'Score', bold: true}],
                        ...tableData,
                    ],
                    
                }
            }

        ],
        styles: {
            header: {
                margin: [0, 0, 0, 0],
                alignment: "center",
                fontSize: 22,
            },
            dataTable: {
                margin: [0, 8, 0, 0],
                alignment: "center"
                
            }

        }
    }
    return definition

}

const listResult = (title, table)=>{
    const definition = {

        content: [
            {
                table: {
                    headerRows: 1,
                    widths: [100, 100, 100, 100],

                    body: [
                        [{text: 'ban', bold: true}, {text: 'eng', bold: true}, {text: "math", bold: true}],
                        ...table.result
                    ],
                    
                }
            }
        ]
    }

    return definition
}

const printer = new PdfPrinter(fonts);

module.exports = {
    printer,
    docDefinition,
    listResult
}