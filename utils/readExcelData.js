import xlsx from 'xlsx';
import path from 'path';

export function readExcelData(filePath = './data/data.xlsx') {
  const absPath = path.resolve(filePath);
  console.log(`Reading Excel file from: ${absPath}`);

  const workbook = xlsx.readFile(absPath);

  const loginSheet = workbook.Sheets['Login'];
  const accountControlSheet = workbook.Sheets['AccountControl'];

  if (!loginSheet || !accountControlSheet) {
    throw new Error(' Excel data missing login or account control sheet');
  }

  const loginDataRaw = xlsx.utils.sheet_to_json(loginSheet)[0];
  const accountControlData = xlsx.utils.sheet_to_json(accountControlSheet);

  return {
    loginData: loginDataRaw,
    accountList: accountControlData,
  };
}
