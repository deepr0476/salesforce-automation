import dotenv from 'dotenv';
dotenv.config();

import { test } from '@playwright/test';
import { readExcelData } from '../utils/readExcelData.js';
import { decrypt } from '../utils/cryptoUtil.js';
import { faker } from '@faker-js/faker';
import { writeAccountResultsToExcel } from '../utils/writeToExcel.js';

const TEST_TIMEOUT = 8 * 60 * 1000;
const NAV_TIMEOUT = 60 * 1000;
const SMALL_DELAY = 500;

test.setTimeout(TEST_TIMEOUT);

function genIndianPhone(provided) {
  if (provided) {
    const d = String(provided).replace(/\D/g, '');
    if (d.length === 10) return `+91${d}`;
    if (d.length === 12 && d.startsWith('91')) return `+${d}`;
  }
  const first = faker.helpers.arrayElement(['9', '8', '7', '6']);
  let rest = '';
  for (let i = 0; i < 9; i++) rest += Math.floor(Math.random() * 10);
  return `+91${first}${rest}`;
}

function mkAccountName(type, first, last, suffix = '') {
  const tag = type.toLowerCase().includes('business') ? 'BA' : 'PA';
  return `RK ${tag} ${first} ${last} ${suffix}`.trim().replace(/\s+/g, ' ');
}

test.describe.parallel('Create accounts from Excel - Bullet Mode', () => {
  test('Fast Account Creation', async ({ page }) => {
    const totalStart = Date.now();
    const { loginData, accountList } = readExcelData();
    const user = decrypt(loginData.Username);
    const pass = decrypt(loginData.Password);

    // Login
    await page.goto('https://login.salesforce.com', { timeout: NAV_TIMEOUT });
    await page.fill('input#username', user);
    await page.fill('input#password', pass);
    await page.click('input#Login');
    await page.waitForSelector('div.slds-global-header', { timeout: NAV_TIMEOUT });
    console.log('Logged in successfully!');

    // Disable animations
    await page.addStyleTag({
      content: '* { transition-duration: 0s !important; animation-duration: 0s !important; }'
    });

    // Navigate to Accounts page once
    await page.getByRole('button', { name: 'App Launcher' }).click();
    const searchBox = page.getByRole('combobox', { name: 'Search apps and items...' });
    await searchBox.waitFor({ state: 'visible', timeout: 15000 });
    await searchBox.fill('Accounts');
    await page.getByRole('option', { name: 'Accounts' }).click();

    await page.waitForURL('**/lightning/o/Account/list**', { timeout: NAV_TIMEOUT });
    await page.getByRole('button', { name: 'New', exact: true }).waitFor({ state: 'visible', timeout: 20000 });

    const outputs = [];

    for (const row of accountList) {
      const type = row['Account Type'] || row.AccountType;
      const cnt = Number(row['Number of Accounts'] || row.NumberOfAccounts) || 0;

      for (let i = 0; i < cnt; i++) {
        const recordStart = Date.now();

        const first = faker.person.firstName();
        const last = faker.person.lastName();
        const phone = genIndianPhone(row.Phone);
        const website = row.Website || `https://www.${first.toLowerCase()}${last.toLowerCase()}.com`;
        const tag = type.toLowerCase().includes('business') ? 'BA' : 'PA';
        const accountName = mkAccountName(
          type,
          first,
          last,
          tag === 'BA' ? faker.helpers.arrayElement(['Ltd', 'Inc', 'Group']) : ''
        );

        try {
          // Click New (stay on list page)
          await page.getByRole('button', { name: 'New', exact: true }).first().click();
          const dialog = page.getByRole('dialog');
          await dialog.waitFor({ state: 'visible', timeout: 15000 });

          if (tag === 'BA') {
            await dialog.getByRole('radio', { name: 'Business Account' }).check();
          } else {
            await dialog.locator('span.slds-form-element__label', { hasText: 'Person Account' }).click();
          }

          await dialog.getByRole('button', { name: 'Next' }).click();

          // Fill form
          if (tag === 'BA') {
            await dialog.locator('input.slds-input[name="Name"]').fill(accountName);
            await dialog.getByRole('textbox', { name: 'Phone' }).fill(phone);
            await dialog.getByRole('textbox', { name: 'Website' }).fill(website);
          } else {
            await dialog.getByRole('textbox', { name: 'First Name' }).fill(`RK ${tag} ${first}`);
            await dialog.getByRole('textbox', { name: 'Last Name' }).fill(last);
            await dialog.getByRole('textbox', { name: 'Phone' }).fill(phone);
            await dialog.getByRole('textbox', { name: 'Website' }).fill(website);
          }

          await dialog.getByRole('button', { name: 'Save', exact: true }).click();

          let accountId = 'unknown';
          try {
            await page.waitForURL(/lightning\/r\/Account\//, { timeout: 20000 });
            const parts = page.url().split('/');
            accountId = parts[parts.length - 2];
          } catch (_) {}

          // Always go back to Account list
          try {
            await page.waitForURL(/lightning\/r\/Account\//, { timeout: 20000 });
            await page.getByRole('link', { name: 'Accounts' }).first().click();
            await page.waitForURL('**/lightning/o/Account/list**', { timeout: NAV_TIMEOUT });
            await page.getByRole('button', { name: 'New', exact: true }).waitFor({
              state: 'visible',
              timeout: 20000
            });
          } catch (err) {
            console.warn(' Could not navigate via breadcrumb, doing fallback reload...');
            await page.goto(
              'https://keonos2-dev-ed.develop.lightning.force.com/lightning/o/Account/list?filterName=Recent',
              { timeout: NAV_TIMEOUT }
            );
            await page.getByRole('button', { name: 'New', exact: true }).waitFor({
              state: 'visible',
              timeout: 20000
            });
          }

          // Calculate per-record time
          const recordEnd = Date.now();
          const recordTime = ((recordEnd - recordStart) / 1000).toFixed(2);

          outputs.push({
            SNo: outputs.length + 1,
            AccountType: type,
            AccountName: accountName,
            Firstname: `RK ${tag} ${first}`,
            Lastname: last,
            Phone: phone,
            Website: website,
            AccountId: accountId,
            Status: accountId === 'unknown' ? 'Fail' : 'Pass',
            Duration: recordTime
          });

          console.log(` ${accountName} created in ${recordTime}s`);
        } catch (err) {
          console.error(` Error creating ${accountName}:`, err);
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
