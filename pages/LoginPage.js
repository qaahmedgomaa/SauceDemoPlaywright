class LoginPage {
    constructor(page) {
        this.page = page;
        this.usernameInput = '#user-name';
        this.passwordInput = '#password';
        this.loginButton = '#login-button';
        this.errorMessage = '[data-test="error"]';
    }

    async navigate() {
        await this.page.goto('/');
    }

    async login(username, password) {
        await this.page.fill(this.usernameInput, username);
        await this.page.fill(this.passwordInput, password);
        await this.page.click(this.loginButton);
    }

    async getErrorMessage() {
        return await this.page.textContent(this.errorMessage);
    }

    async isErrorMessageVisible() {
        return await this.page.isVisible(this.errorMessage);
    }
}

module.exports = LoginPage; 