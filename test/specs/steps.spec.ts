import { Given, When, Then } from '@wdio/cucumber-framework';

import HomePage from '../../src/web/pageObjects/home.page';
import SecurePage from '../../src/web/pageObjects/secure.page';
import RegisterPage from '../../src/web/pageObjects/register.page';
import LoginPage from '../../src/web/pageObjects/login.page';
import LogoutPage from '../../src/web/pageObjects/logout.page';
import { registerMessage } from '../resources/assertionMessage';
import { cart, homePageProduct, productDetails } from '../resources/data';
import chai = require('chai');

const expectChai = chai.expect;
const pages = {
    home: HomePage
}

Given(/^User on the (\w+) page$/, async (page) => {
    await pages[page].open();
    await expectChai(await browser.getUrl()).to.be.equal(process.env.BASE_URL + 'index.php?route=common/' + page);
});

When(/^User register with new credential$/, async () => {
    await HomePage.register();
    // await browser.pause(2000);
    await expectChai(await browser.getUrl()).to.be.equal(process.env.BASE_URL + 'index.php?route=account/register');
    await RegisterPage.register();
});

Then(/^Verify user registered successful$/, async () => {
    await expectChai(await RegisterPage.getRegisterText()).to.be.equal(registerMessage.accountCreatedHeader);
    await expectChai(await RegisterPage.getSuccessfulMessageText()).to.be.equal(registerMessage.successfulMessage);
    await RegisterPage.continue();
});

When(/^User navigate to logout page$/, async () => {
    await HomePage.logout();
    await expectChai(await browser.getUrl()).to.be.equal(process.env.BASE_URL + 'index.php?route=account/logout');
    await LogoutPage.logout();
});

Then(/^Verify after logout user will return back to (\w+) page$/, async (page) => {
    await expectChai(await browser.getUrl()).to.be.equal(process.env.BASE_URL + 'index.php?route=common/' + page);
});

When(/^User navigate to login page$/, async () => {
    await HomePage.login();
    await expectChai(await browser.getUrl()).to.be.equal(process.env.BASE_URL + 'index.php?route=account/login');
    await LoginPage.login();
})

Then(/^Verify after login user will navigate to (\w+) page$/, async (page) => {
    await expectChai(await browser.getUrl()).to.be.equal(process.env.BASE_URL + 'index.php?route=account/' + page);
});

When(/^User scroll to product$/, async () => {
    await HomePage.navigateToHomePage();
    await HomePage.scrollToProduct();
})

When(/^User add product to the cart$/, async () => {
    let cartAmount = 0
    for (let i of homePageProduct) {
        let price = productDetails[i].price;
        await HomePage.clickOnAddToCart(i, price)
            .then((text) => {
                expectChai(i).to.be.equal(text);
            })
        cartAmount = await cartAmount + price;
        await browser.pause(200);
        let amount = await HomePage.getCartTotalText();
        await expectChai(amount).to.be.equal(cartAmount,"Amount doesn't match");
    }
    cart.cartTotal = cartAmount;
})

Then(/^Verify cart amount is updated according to product selections$/, async () => {
    let amount = await HomePage.getCartTotalText();
    await expectChai(amount).to.be.equal(cart.cartTotal);
})

When(/^User remove item from cart$/, async () => {
    await HomePage.removeItem();
    await browser.pause(500);
    let amount = await HomePage.cartTotalFromTable();
    await expectChai(amount).to.be.equal(cart.cartTotal);
})

When(/^User navigate to all top menu bar$/, async () => {
    await HomePage.hoverOnTopMenuDropDown();
    await HomePage.navigateToTopNonDropDown();
})
