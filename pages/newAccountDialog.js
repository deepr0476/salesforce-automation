// pages/newAccountDialog.js
import { faker } from '@faker-js/faker';

// 🔹 Custom Indian phone number generator
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

export class NewAccountDialog {
  constructor(page) {
    this.page = page;
  }

  async createAccount(row) {
    const type = row['Account Type'] || row.AccountType;
    const tag = type.toLowerCase().includes('business') ? 'BA' : 'PA';
    const first = faker.person.firstName();
    const last = faker.person.lastName();
    const phone = genIndianPhone(row.Phone);
    const website = row.Website || `https://www.${first.toLowerCase()}${last.toLowerCase()}.com`;

    const accountName = tag === 'BA'
      ? `RK ${tag} ${first} ${last} ${faker.helpers.arrayElement(['Ltd', 'Inc', 'Group'])}`
      : `RK ${tag} ${first} ${last}`;

    const dialog = this.page.getByRole('dialog');
    await dialog.waitFor({ state: 'visible', timeout: 15000 });

    try {
      // Select account type
      if (tag === 'BA') {
        await dialog.getByRole('radio', { name: 'Business Account' }).check();
      } else {
        await dialog.locator('span.slds-form-element__label', { hasText: 'Person Account' }).click();
      }

      await dialog.getByRole('button', { name: 'Next' }).click();

      // Fill fields
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

      // Get account ID
      let accountId = 'unknown';
      try {
        await this.page.waitForURL(/lightning\/r\/Account\//, { timeout: 20000 });
        const parts = this.page.url().split('/');
        accountId = parts[parts.length - 2];
      } catch (_) {}

      // 🟢 Single clean console log
      return {
        AccountType: type,
        AccountName: accountName,
        Firstname: `RK ${tag} ${first}`,
        Lastname: last,
        Phone: phone,
        Website: website,
        AccountId: accountId,
        Status: accountId === 'unknown' ? 'Fail' : 'Pass'
      };
    } catch (err) {
      console.error(`❌ Error creating account:`, err);
      return { AccountName: accountName, Status: 'Fail', Error: err.message };
    }
  }
}
