const xlsx = require('xlsx');
const path = require('path');

function readExcelData() {
  const filePath = path.resolve(__dirname, './data/data.xlsx');
  console.log(`📄 Reading Excel file from: ${filePath}`);

  const workbook = xlsx.readFile(filePath);
  const loginSheet = workbook.Sheets['Login'];
  const accountControlSheet = workbook.Sheets['AccountControl'];

  if (!loginSheet || !accountControlSheet) {
    throw new Error('❌ Excel data missing login or account control sheet data');
  }

  const loginDataRaw = xlsx.utils.sheet_to_json(loginSheet)[0];
  const accountControlData = xlsx.utils.sheet_to_json(accountControlSheet);

  console.log('Login Data Raw:', loginDataRaw);
  console.log('Account Control Data:', accountControlData);

  return { loginDataRaw, accountControlData };
}

readExcelData();
