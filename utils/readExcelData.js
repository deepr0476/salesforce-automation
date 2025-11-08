import xlsx from 'xlsx';
import path from 'path';
import fs from 'fs';

export function readExcelData(filePath = './data/data.xlsx') {
  const absPath = path.resolve(filePath);
  console.log(`Reading Excel file from: ${absPath}`);

  if (!fs.existsSync(absPath)) {
    throw new Error(`❌ Excel file not found at: ${absPath}`);
  }

  const workbook = xlsx.readFile(absPath);
  const loginSheet = workbook.Sheets['Login'];
  const accountControlSheet = workbook.Sheets['AccountControl'];

  if (!loginSheet || !accountControlSheet) {
    throw new Error('❌ Excel missing "Login" or "AccountControl" sheets.');
  }

  const loginDataRaw = xlsx.utils.sheet_to_json(loginSheet)[0];
  const accountControlData = xlsx.utils.sheet_to_json(accountControlSheet);

  return {
    loginData: loginDataRaw,
    accountList: accountControlData,
  };
}
