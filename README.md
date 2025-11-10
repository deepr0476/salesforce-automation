# 🚀 Salesforce Account Automation (Playwright + Excel Framework)

This project automates **Salesforce Account Creation** using [Playwright](https://playwright.dev/), reading account data from Excel, and writing the results back for reporting.  
It’s designed with a **modular framework structure** for scalability and reusability.

---

## 🧩 Project Overview

- **Automates account creation** (both Business & Person accounts).
- **Reads input data** (account types, number of records, etc.) from Excel.
- **Writes output data** (Account Name, ID, Status, Duration) to Excel.
- Uses **Faker.js** for random test data generation.
- Fully supports **environment variables** via `.env` for credentials.
- Captures **screenshots and videos** on failure for debugging.
- Generates **HTML reports** for easy test result analysis.

---

## ⚙️ Folder Structure
salesforce-automation/  
│  
├── config/             # Environment or Playwright configs  
├── data/               # Excel input data (ignored in git)  
├── Evidence/           # Test output files and screenshots/videos (ignored in git)  
├── pages/              # Page Object files (loginPage, accountsPage, newAccountDialog)  
├── tests/              # Test specs  
├── utils/              # Utility modules (Excel, Crypto, Faker helpers)  
│  
├── .env                # Encrypted Salesforce credentials  
├── .gitignore  
├── package.json  
└── README.md  

---

## ⚙️ Setup Instructions

### 1️⃣ Install dependencies
```bash
npm install

---------------------

Configure environment

Create a .env file in the project root:

SF_USERNAME_ENC=your_encrypted_username
SF_PASSWORD_ENC=your_encrypted_password

Prepare test data

Place your Excel file inside /data/data.xlsx with sheets:

Login → contains encrypted username & password

AccountControl → defines account types and count


Features

Data-driven tests from Excel files

Page Object Model (POM) design for maintainability

Automated screenshots and video recording on test failures

HTML reporting for detailed and user-friendly test results

Environment variable support for secure credential management

Runs tests in headed mode for easy visual debugging

Supports parallel test execution (if enabled)


How to Run Tests
To run all tests:
npx playwright test
--------------------
To run tests with detailed HTML report view:

npx playwright show-report
---------

Future Improvements

Add retry logic for flaky tests

Extend automation to other Salesforce modules

Integrate CI/CD pipelines for scheduled runs

Add notification support on test completion (Slack/Email)

Note: This framework is built keeping modularity, scalability, and maintainability in mind to support continuous test development and integration.



