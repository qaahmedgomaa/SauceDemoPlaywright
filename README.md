# Sauce Demo E-commerce Test Automation

This project contains end-to-end test automation for the Sauce Demo e-commerce website using Playwright with JavaScript.

## Project Structure
```
├── tests/                  # Test files
├── pages/                  # Page Object Models
├── utils/                  # Utility functions
├── data/                   # Test data files
├── config/                 # Configuration files
├── screenshots/           # Screenshots on test failure
└── reports/               # Test execution reports
```

## Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)

## Installation
1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Install Playwright browsers:
```bash
npx playwright install
```

## Running Tests
- Run all tests:
```bash
npm test
```
- Run tests in specific browser:
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```
- Run tests with specific tag:
```bash
npx playwright test --grep @smoke
```

## Test Reports
After test execution, HTML reports can be found in the `reports` directory.

## Features
- Page Object Model implementation
- Cross-browser testing support
- Screenshot capture on failure
- HTML test reports
- Test data abstraction
- Parallel test execution
- Retry mechanism for flaky tests

## Tools & Libraries
- Playwright
- JavaScript
- ESLint/Prettier (for code formatting)
- Allure Reports (for test reporting)

## Assumptions
- Tests are run against the production environment (https://www.saucedemo.com)
- Standard user credentials are used for testing
- Cross-browser testing is performed on Chromium, Firefox, and WebKit 