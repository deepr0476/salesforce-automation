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
