const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const InventoryPage = require('../pages/InventoryPage');
const testData = require('../data/testData');

test.describe('Inventory Page Functionality', () => {
    let loginPage;
    let inventoryPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        
        // Login before each test
        await loginPage.navigate();
        await loginPage.login(
            testData.validUser.username,
            testData.validUser.password
        );
        await page.waitForURL('**/inventory.html');
    });

    test('should sort products by price low to high and add two cheapest items to cart', async () => {
        // Sort products by price low to high
        await inventoryPage.sortProductsByPriceLowToHigh();
        
        // Get the first two products (cheapest)
        const firstTwoProducts = await inventoryPage.getFirstTwoProducts();
        
        // Add first product to cart
        await inventoryPage.addProductToCart(0);
        expect(await inventoryPage.getCartItemCount()).toBe(1);
        
        // Add second product to cart
        await inventoryPage.addProductToCart(1);
        expect(await inventoryPage.getCartItemCount()).toBe(2);
        
        // Validate the products added to cart
        const cartItems = await inventoryPage.getFirstTwoProducts();
        expect(cartItems[0].name).toBe(firstTwoProducts[0].name);
        expect(cartItems[0].price).toBe(firstTwoProducts[0].price);
        expect(cartItems[1].name).toBe(firstTwoProducts[1].name);
        expect(cartItems[1].price).toBe(firstTwoProducts[1].price);
    });

    test('should verify products are sorted by price low to high', async () => {
        // Sort products by price low to high
        await inventoryPage.sortProductsByPriceLowToHigh();
        
        // Get all product prices
        const products = await inventoryPage.getProductDetails();
        const prices = products.map(product => {
            // Convert price string to number (remove $ and convert to float)
            return parseFloat(product.price.replace('$', ''));
        });
        
        // Verify prices are in ascending order
        const isSorted = prices.every((price, index) => {
            if (index === 0) return true;
            return price >= prices[index - 1];
        });
        
        expect(isSorted).toBeTruthy();
    });
}); 