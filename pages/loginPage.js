// pages/loginPage.js
import { expect } from '@playwright/test';

export class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameField = 'input#username';
    this.passwordField = 'input#password';
    this.loginButton = 'input#Login';
    this.headerSelector = 'div.slds-global-header';
  }

  async login(username, password) {
    await this.page.goto('https://login.salesforce.com', { timeout: 60000 });
    await this.page.fill(this.usernameField, username);
    await this.page.fill(this.passwordField, password);
    await this.page.click(this.loginButton);

    await this.page.waitForSelector(this.headerSelector, { timeout: 60000 });
    console.log('✅ Logged in successfully!');
  }
}

