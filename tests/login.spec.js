const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const testData = require('../data/testData');

test.describe('Login Functionality', () => {
    let loginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.navigate();
    });

    test('should login successfully with valid credentials', async ({ page }) => {
        await loginPage.login(
            testData.validUser.username,
            testData.validUser.password
        );
        await page.waitForURL('**/inventory.html', { timeout: 5000 });
        await expect(page).toHaveURL(/.*inventory.html/);
    });

    test('should show error message with invalid credentials', async () => {
        await loginPage.login(
            testData.invalidUser.username,
            testData.invalidUser.password
        );
        const errorMessage = await loginPage.getErrorMessage();
        expect(errorMessage).toBe(testData.expectedMessages.loginError);
    });
}); 