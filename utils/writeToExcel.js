const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

const evidenceFolder = path.resolve(__dirname, '../Evidence');

//  Ensure the Evidence folder exists
if (!fs.existsSync(evidenceFolder)) {
  fs.mkdirSync(evidenceFolder);
}

// IST timestamp function
function getTimestamp() {
  const now = new Date();

  const formatter = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  const parts = formatter.formatToParts(now);
  const get = (type) => parts.find(p => p.type === type)?.value;

  return `${get('year')}${get('month')}${get('day')}_${get('hour')}${get('minute')}${get('second')}`;
}

//  Write account data to a timestamped Excel file
async function writeAccountResultsToExcel(data) {
  const workbook = new ExcelJS.Workbook();

  // Generate filename with IST timestamp
  const fileName = `test-data_${getTimestamp()}.xlsx`;
  const outputFile = path.join(evidenceFolder, fileName);

  const sheet = workbook.addWorksheet('Output');
  sheet.columns = [
  { header: 'SNo', key: 'SNo' },
  { header: 'AccountType', key: 'AccountType' },
  { header: 'AccountName', key: 'AccountName' },
  { header: 'Firstname', key: 'Firstname' },
  { header: 'Lastname', key: 'Lastname' },
  { header: 'Phone', key: 'Phone' },
  { header: 'Website', key: 'Website' },
  { header: 'AccountId', key: 'AccountId' },
  { header: 'Status', key: 'Status' },
  { header: 'Duration(s)', key: 'Duration' }, 
];


  data.forEach((row) => {
    sheet.addRow(row);
  });

  await workbook.xlsx.writeFile(outputFile);
  console.log(' Output written to Excel at:', outputFile);

  return outputFile;
}

module.exports = { writeAccountResultsToExcel };

