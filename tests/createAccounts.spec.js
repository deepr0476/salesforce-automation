import dotenv from 'dotenv';
dotenv.config();

import { test } from '@playwright/test';
import { readExcelData } from '../utils/readExcelData.js';
import { decrypt } from '../utils/cryptoUtil.js';
import { writeAccountResultsToExcel } from '../utils/writeToExcel.js';
import { LoginPage } from '../pages/loginPage.js';
import { AccountsPage } from '../pages/accountsPage.js';
import { NewAccountDialog } from '../pages/newAccountDialog.js';

const TEST_TIMEOUT = 8 * 60 * 1000;
const NAV_TIMEOUT = 60 * 1000;
const SMALL_DELAY = 500;

test.setTimeout(TEST_TIMEOUT);

test.describe.parallel('Create accounts from Excel', () => {

  test('Automated Account Creation', async ({ page }) => {

    const totalStart = Date.now();
    const { loginData, accountList } = readExcelData();

    const username = decrypt(loginData.Username);
    const password = decrypt(loginData.Password);

    const loginPage = new LoginPage(page);
    const accountsPage = new AccountsPage(page);
    const newAccountDialog = new NewAccountDialog(page);

    await loginPage.login(username, password);
    await accountsPage.openAccountsPage();

    const outputs = [];

    for (const row of accountList) {
      const type = row['Account Type'] || row.AccountType;
      const cnt = Number(row['Number of Accounts'] || row.NumberOfAccounts) || 0;

      for (let i = 0; i < cnt; i++) {
        const recordStart = Date.now();

        try {
          await accountsPage.clickNew();
          const accountResult = await newAccountDialog.createAccount(row);

          try {
            await page.waitForURL(/lightning\/r\/Account\//, { timeout: 20000 });
            await page.getByRole('link', { name: 'Accounts' }).first().click();
            await page.waitForURL('**/lightning/o/Account/list**', { timeout: NAV_TIMEOUT });
            await page.getByRole('button', { name: 'New', exact: true }).waitFor({
              state: 'visible',
              timeout: 20000
            });
          } catch {
            console.warn('⚠️ Could not navigate via breadcrumb, reloading list...');
            await page.goto(
              'https://keonos2-dev-ed.develop.lightning.force.com/lightning/o/Account/list?filterName=Recent',
              { timeout: NAV_TIMEOUT }
            );
            await page.getByRole('button', { name: 'New', exact: true }).waitFor({
              state: 'visible',
              timeout: 20000
            });
          }

          const recordEnd = Date.now();
          const recordTime = ((recordEnd - recordStart) / 1000).toFixed(2);

          outputs.push({
            SNo: outputs.length + 1,
            ...accountResult,
            Duration: recordTime
          });

          console.log(`✅ ${accountResult.AccountName} created in ${recordTime}s`);

        } catch (err) {
          console.error(`❌ Error in loop for account type ${type}:`, err);
        }

        await page.waitForTimeout(SMALL_DELAY);
      }
    }

    if (outputs.length) {
      await writeAccountResultsToExcel(outputs);
    }

    const totalEnd = Date.now();
    const totalTime = ((totalEnd - totalStart) / 1000).toFixed(2);
    console.log(`⚡ All accounts processed in ${totalTime}s`);
  });
});
