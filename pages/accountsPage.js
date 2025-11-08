// pages/accountsPage.js
export class AccountsPage {
  constructor(page) {
    this.page = page;
    this.appLauncherBtn = this.page.getByRole('button', { name: 'App Launcher' });
    this.searchBox = this.page.getByRole('combobox', { name: 'Search apps and items...' });
    this.accountsOption = this.page.getByRole('option', { name: 'Accounts' });
    this.newButton = this.page.getByRole('button', { name: 'New', exact: true });
  }

  async openAccountsPage() {
    // Disable animations for stability
    await this.page.addStyleTag({
      content: '* { transition-duration: 0s !important; animation-duration: 0s !important; }'
    });

    await this.appLauncherBtn.click();
    await this.searchBox.waitFor({ state: 'visible', timeout: 15000 });
    await this.searchBox.fill('Accounts');
    await this.accountsOption.click();

    await this.page.waitForURL('**/lightning/o/Account/list**', { timeout: 60000 });
    await this.newButton.waitFor({ state: 'visible', timeout: 20000 });

    console.log('✅ Accounts page opened successfully!');
  }

  async clickNew() {
    await this.newButton.first().click();
  }
}
