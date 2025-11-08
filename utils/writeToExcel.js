// utils/writeToExcel.js
import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function writeAccountResultsToExcel(outputs) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Account Results');

  worksheet.columns = [
    { header: 'S.No', key: 'SNo', width: 10 },
    { header: 'Account Type', key: 'AccountType', width: 20 },
    { header: 'Account Name', key: 'AccountName', width: 30 },
    { header: 'Firstname', key: 'Firstname', width: 20 },
    { header: 'Lastname', key: 'Lastname', width: 20 },
    { header: 'Phone', key: 'Phone', width: 20 },
    { header: 'Website', key: 'Website', width: 30 },
    { header: 'Account Id', key: 'AccountId', width: 25 },
    { header: 'Status', key: 'Status', width: 10 },
    { header: 'Duration (s)', key: 'Duration', width: 15 }
  ];

  outputs.forEach((row) => worksheet.addRow(row));

  // 🔹 test-data style timestamp
  const now = new Date();
  const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;

  // 🔹 Save inside Evidence folder
  const outputDir = path.join(__dirname, '../Evidence');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`📁 Created folder: ${outputDir}`);
  }

  const filePath = path.join(outputDir, `test-data_${timestamp}.xlsx`);
  await workbook.xlsx.writeFile(filePath);

  console.log(`✅ Results saved to: ${filePath}`);
}
