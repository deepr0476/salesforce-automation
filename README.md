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

---

## ⚙️ Folder Structure
salesforce-automation/
│
├── config/ # Environment or Playwright configs
├── data/ # Excel input data (ignored in git)
├── Evidence/ # Test output files and screenshots (ignored in git)
├── pages/ # Page Object files (loginPage, accountsPage, newAccountDialog)
├── tests/ # Test specs
├── utils/ # Utility modules (Excel, Crypto, Faker helpers)
│
├── .env # Encrypted Salesforce credentials
├── .gitignore
├── package.json
└── README.md

---

## ⚙️ Setup Instructions

### 1️⃣ Install dependencies
```bash
npm install

Configure environment

Create a .env file in the project root:
SF_USERNAME_ENC=your_encrypted_username
SF_PASSWORD_ENC=your_encrypted_password

Prepare test data

Put your Excel file inside /data/data.xlsx with sheets:

Login → contains encrypted username & password

AccountControl → defines account types and count

