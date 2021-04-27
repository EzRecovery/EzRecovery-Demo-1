const fs = require('fs')
const json2xls = require('json2xls')

module.exports = exportToExcel = async (path, date, data) => {
    let xls = json2xls(data)
    let savePath = path + 'EzRecovery_export_' + date + '.xlsx';
    const res = fs.writeFileSync(savePath, xls, 'binary');
    return 1;
}

