const { expect } = require('@playwright/test');

class OrderConfirmationPage {
    constructor(page) {
        this.page = page;
        this.completeHeader = '.complete-header';
        this.completeText = '.complete-text';
        this.backHomeButton = '[data-test="back-to-products"]';
        this.ponyExpressImage = '.pony_express';
    }

    async getOrderConfirmationDetails() {
        await this.page.waitForSelector(this.completeHeader, { state: 'visible', timeout: 5000 });
        
        return {
            header: await this.page.textContent(this.completeHeader),
            text: await this.page.textContent(this.completeText),
            isPonyExpressVisible: await this.page.isVisible(this.ponyExpressImage)
        };
    }

    async verifyOrderConfirmation(expectedMessage) {
        const confirmation = await this.getOrderConfirmationDetails();
        
        // Verify the success message
        expect(confirmation.header).toBe(expectedMessage);
        
        // Verify the confirmation text contains expected content
        expect(confirmation.text).toContain('Your order has been dispatched');
        
        // Verify the pony express image is visible
        expect(confirmation.isPonyExpressVisible).toBeTruthy();
    }

    async returnToHome() {
        await this.page.click(this.backHomeButton);
        await this.page.waitForURL('**/inventory.html');
    }
}

module.exports = OrderConfirmationPage; 