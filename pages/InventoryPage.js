class InventoryPage {
    constructor(page) {
        this.page = page;
        this.sortDropdown = this.page.locator('[data-test="product-sort-container"]');
        this.productItems = '.inventory_item';
        this.productName = '.inventory_item_name';
        this.productPrice = '.inventory_item_price';
        this.addToCartButton = '[data-test^="add-to-cart"]';
        this.cartBadge = '.shopping_cart_badge';
    }

    async sortProductsByPriceLowToHigh() {
        await this.sortDropdown.waitFor({ state: 'visible', timeout: 5000 });
        await this.sortDropdown.selectOption('lohi');
    }

    async getProductDetails() {
        const products = await this.page.$$(this.productItems);
        const productDetails = [];

        for (const product of products) {
            const name = await product.$(this.productName);
            const price = await product.$(this.productPrice);
            const addToCartBtn = await product.$(this.addToCartButton);

            productDetails.push({
                name: await name.textContent(),
                price: await price.textContent(),
                addToCartButton: addToCartBtn
            });
        }

        return productDetails;
    }

    async addProductToCart(productIndex) {
        const products = await this.page.$$(this.productItems);
        const addToCartBtn = await products[productIndex].$(this.addToCartButton);
        await addToCartBtn.click();
    }

    async getCartItemCount() {
        const badge = await this.page.$(this.cartBadge);
        if (badge) {
            return parseInt(await badge.textContent());
        }
        return 0;
    }

    async getFirstTwoProducts() {
        const products = await this.getProductDetails();
        return products.slice(0, 2);
    }
}

module.exports = InventoryPage; 