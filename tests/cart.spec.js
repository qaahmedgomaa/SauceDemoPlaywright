const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const InventoryPage = require('../pages/InventoryPage');
const CartPage = require('../pages/CartPage');
const testData = require('../data/testData');

test.describe('Cart Page Functionality', () => {
    let loginPage;
    let inventoryPage;
    let cartPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);
        
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
    });

    test('should verify cart items and proceed to checkout', async ({page}) => {
        // Get the two products we added on Inventory page
        const addedProducts = await inventoryPage.getFirstTwoProducts();
    
        // Navigate to cart page
        await cartPage.navigate();
    
        // Get the cart items from the cart page
        const cartItems = await cartPage.getCartItems();
    
        // Verify number of items in cart matches expected number
        expect(cartItems.length).toBe(addedProducts.length);
    
        // Verify each cart item's name, price, and quantity (assuming quantity is always 1)
        for (let i = 0; i < addedProducts.length; i++) {
            expect(cartItems[i].name).toBe(addedProducts[i].name);
            expect(cartItems[i].price).toBe(addedProducts[i].price);
            expect(cartItems[i].quantity).toBe(1);
        }
    
        // Verify total item count (sum of quantities)
        const totalItems = await cartPage.getTotalItemCount();
        expect(totalItems).toBe(addedProducts.length);
    
        // Verify individual prices again (redundant, but if you want it explicitly)
        expect(cartItems[0].price).toBe(addedProducts[0].price);
        expect(cartItems[1].price).toBe(addedProducts[1].price);
    
        // Verify total price equals sum of individual product prices * quantities
        const totalPrice = await cartPage.getTotalPrice();
        const expectedTotal = addedProducts.reduce((sum, product) => {
            return sum + parseFloat(product.price.replace('$', ''));
        }, 0);
        expect(totalPrice).toBeCloseTo(expectedTotal, 2);  // Use toBeCloseTo for floats
    
        // Proceed to checkout
        await cartPage.proceedToCheckout();
    
        // Verify URL changed to checkout step one
        await expect(page).toHaveURL(/.*checkout-step-one.html/);
    });    
}); 