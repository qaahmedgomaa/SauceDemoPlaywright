const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const InventoryPage = require('../pages/InventoryPage');
const CartPage = require('../pages/CartPage');
const CheckoutPage = require('../pages/CheckoutPage');
const OrderConfirmationPage = require('../pages/OrderConfirmationPage');
const testData = require('../data/testData');

test.describe('Order Confirmation', () => {
    let loginPage;
    let inventoryPage;
    let cartPage;
    let checkoutPage;
    let orderConfirmationPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page);
        orderConfirmationPage = new OrderConfirmationPage(page);
        
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
        
        // Navigate to cart and proceed to checkout
        await cartPage.navigate();
        await cartPage.proceedToCheckout();
        
        // Complete checkout process
        await checkoutPage.fillCustomerInfo(
            testData.customerInfo.firstName,
            testData.customerInfo.lastName,
            testData.customerInfo.postalCode
        );
        await checkoutPage.completeOrder();
    });

    test('should display order confirmation message and details', async () => {
        // Verify order confirmation message and details
        await orderConfirmationPage.verifyOrderConfirmation(
            testData.expectedMessages.orderConfirmation
        );
    });

    test('should be able to return to home page after order completion', async ({ page }) => {
        // Verify order confirmation first
        await orderConfirmationPage.verifyOrderConfirmation(
            testData.expectedMessages.orderConfirmation
        );
        
        // Return to home page
        await orderConfirmationPage.returnToHome();
        
        // Verify we're back on the inventory page
        await expect(page).toHaveURL(/.*inventory.html/);
    });
}); 