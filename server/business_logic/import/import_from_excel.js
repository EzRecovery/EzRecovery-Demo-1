const readXlsxFile = require('read-excel-file/node');

const schema = {
    'Id': {
        prop: 'Id',
        type: parseInt(String)
    },
    'Name': {
        prop: 'Name',
        type: String
    },
    'Bank': {
        prop: 'Bank_Name',
        type: String
    },
    'Address': {
        prop: 'Address',
        type: String
    },
    'Contact No': {
        prop: 'Contact_No',
        type: parseInt(String)
    },
    'Alternate Contact No': {
        prop: 'Alternate_Contact_No',
        type: parseInt(String)
    },
    'Debt to clear': {
        prop: 'Debt_to_clear',
        type: parseInt(String)
    },
    'Area': {
        prop: 'Area_Id',
        type: parseInt(String)
    },
    'Status': {
        prop: 'Status',
        type: String
    },
}


const readData = async (filePath) => {
    return new Promise((resolve, reject) => {
        readXlsxFile(filePath, { schema }).then(({ rows, errors }) => {
            return resolve(rows)
        });
    })
}


module.exports = importFromExcel = async (fileName) => {
    const filePath = fileName;
    const result = await readData(filePath)
    return result;
}
