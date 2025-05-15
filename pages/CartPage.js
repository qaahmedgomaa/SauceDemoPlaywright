class CartPage {
    constructor(page) {
        this.page = page;
        this.cartItems = '.cart_item';
        this.itemName = '.inventory_item_name';
        this.itemPrice = '.inventory_item_price';
        this.itemQuantity = '.cart_quantity';
        this.cartBadge = '.shopping_cart_badge';
        this.checkoutButton = '[data-test="checkout"]';
    }

    async navigate() {
        await this.page.click('.shopping_cart_link');
        await this.page.waitForURL('**/cart.html');
    }

    async getCartItems() {
        const items = await this.page.$$(this.cartItems);
        const cartItems = [];

        for (const item of items) {
            const name = await item.$(this.itemName);
            const price = await item.$(this.itemPrice);
            const quantity = await item.$(this.itemQuantity);

            cartItems.push({
                name: await name.textContent(),
                price: await price.textContent(),
                quantity: parseInt(await quantity.textContent())
            });
        }

        return cartItems;
    }

    async getTotalItemCount() {
        const items = await this.getCartItems();
        return items.reduce((total, item) => total + item.quantity, 0);
    }

    async getTotalPrice() {
        await this.page.waitForSelector('.inventory_item_price'); // ensures elements are loaded
        
        const priceElements = await this.page.$$('.inventory_item_price');
        let total = 0;
    
        for (const element of priceElements) {
            const priceText = await element.textContent();
            const match = priceText.match(/\$(\d+\.\d+)/);
            if (match) {
                total += parseFloat(match[1]);
            }
        }
    
        return total;
    }
    
    
    

    async proceedToCheckout() {
        await this.page.click(this.checkoutButton);
        await this.page.waitForURL('**/checkout-step-one.html');
    }

    async getCartItemsDetails() {
        return await this.getCartItems();
    }
}

module.exports = CartPage; 