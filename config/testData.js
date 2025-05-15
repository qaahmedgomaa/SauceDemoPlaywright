module.exports = {
    validUser: {
        username: 'standard_user',
        password: 'secret_sauce'
    },
    invalidUser: {
        username: 'invalid_user',
        password: 'invalid_password'
    },
    customerInfo: {
        firstName: 'John',
        lastName: 'Doe',
        postalCode: '12345'
    },
    expectedMessages: {
        loginError: 'Epic sadface: Username and password do not match any user in this service',
        orderConfirmation: 'Thank you for your order!'
    }
}; 