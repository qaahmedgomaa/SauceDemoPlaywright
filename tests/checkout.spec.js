const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const InventoryPage = require('../pages/InventoryPage');
const CartPage = require('../pages/CartPage');
const CheckoutPage = require('../pages/CheckoutPage');
const testData = require('../data/testData');

test.describe('Checkout Flow', () => {
    let loginPage;
    let inventoryPage;
    let cartPage;
    let checkoutPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page);

        // Login and add items to cart
        await loginPage.navigate();
        await loginPage.login(
            testData.validUser.username,
            testData.validUser.password
        );
        await page.waitForURL('**/inventory.html');

        // Sort products and add two cheapest items
        await inventoryPage.sortProductsByPriceLowToHigh();
        await inventoryPage.addProductToCart(0);
        await inventoryPage.addProductToCart(1);

        // Navigate to cart
        await cartPage.navigate();

        // ✅ Get the expected item total before going to checkout
        const expectedItemTotal = await cartPage.getTotalPrice();
        // Store it on the cartPage object for later use
        cartPage.expectedItemTotal = Number(expectedItemTotal);

        // Proceed to checkout
        await cartPage.proceedToCheckout();
    });

    test('should complete checkout process with valid customer information', async ({ page }) => {
        const expectedItemTotalNum = cartPage.expectedItemTotal;
        // console.log('Expected item total:', expectedItemTotalNum); // Debug

        // Fill customer information
        await checkoutPage.fillCustomerInfo(
            testData.customerInfo.firstName,
            testData.customerInfo.lastName,
            testData.customerInfo.postalCode
        );

        // Get order summary from checkout step two page
        const summary = await checkoutPage.getOrderSummary();
        // console.log('Order summary:', summary);

        // Assertions
        expect(typeof summary.itemTotal).toBe('number');
        expect(summary.itemTotal).toBeCloseTo(expectedItemTotalNum, 2);

        const expectedTax = expectedItemTotalNum * 0.08;
        expect(summary.tax).toBeCloseTo(expectedTax, 2);

        const expectedTotal = expectedItemTotalNum + expectedTax;
        expect(summary.total).toBeCloseTo(expectedTotal, 2);

        await checkoutPage.completeOrder();

        const confirmation = await checkoutPage.getOrderConfirmation();
        expect(confirmation.header).toBe(testData.expectedMessages.orderConfirmation);
    });
});
