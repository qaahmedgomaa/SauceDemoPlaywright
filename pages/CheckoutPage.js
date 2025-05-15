class CheckoutPage {
    constructor(page) {
        this.page = page;
        // Step One Elements
        this.firstNameInput = '[data-test="firstName"]';
        this.lastNameInput = '[data-test="lastName"]';
        this.postalCodeInput = '[data-test="postalCode"]';
        this.continueButton = '[data-test="continue"]';

        // Step Two Elements
        this.itemTotal = '.summary_subtotal_label';
        this.taxAmount = '.summary_tax_label';
        this.totalAmount = '.summary_total_label';
        this.finishButton = '[data-test="finish"]';

        // Order Complete Elements
        this.completeHeader = '.complete-header';
        this.completeText = '.complete-text';
    }

    async fillCustomerInfo(firstName, lastName, postalCode) {
        await this.page.fill(this.firstNameInput, firstName);
        await this.page.fill(this.lastNameInput, lastName);
        await this.page.fill(this.postalCodeInput, postalCode);
        await this.page.click(this.continueButton);
        await this.page.waitForURL('**/checkout-step-two.html');
    }

    async getOrderSummary() {
        await this.page.waitForSelector(this.itemTotal, { state: 'visible', timeout: 5000 });
        
        const itemTotalText = await this.page.textContent(this.itemTotal);
        const taxText = await this.page.textContent(this.taxAmount);
        const totalText = await this.page.textContent(this.totalAmount);

        // console.log('Order summary texts:', { itemTotalText, taxText, totalText });
    
        return {
            itemTotal: this.extractPrice(itemTotalText),
            tax: this.extractPrice(taxText),
            total: this.extractPrice(totalText)
        };
    }

    extractPrice(text) {
        // Extract price from text like "Item total: $29.98"
        const match = text.match(/\$(\d+\.\d+)/);
        return match ? parseFloat(match[1]) : 0;
    }

    async completeOrder() {
        await this.page.click(this.finishButton);
        await this.page.waitForURL('**/checkout-complete.html');
    }

    async getOrderConfirmation() {
        const header = await this.page.textContent(this.completeHeader);
        const text = await this.page.textContent(this.completeText);
        return { header, text };
    }
}

module.exports = CheckoutPage;
