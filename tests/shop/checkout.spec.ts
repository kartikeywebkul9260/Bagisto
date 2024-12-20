import { test } from '@playwright/test';
import config from '../../Config/config';
import addToCart from '../../Helpers/shop/cartHelper';
import logIn from '../../Helpers/shop/loginHelper';
import address from '../../Helpers/shop/addressHelper';
import * as forms from '../../Helpers/shop/formHelper';

const { chromium, firefox, webkit } = await import('playwright');
const baseUrl = config.baseUrl;

let browser;
let context;
let page;

// Perform login once before all tests
test.beforeAll(async () => {
    // Launch the specified browser
    if (config.browser === 'firefox') {
        browser = await firefox.launch();
    } else if (config.browser === 'webkit') {
        browser = await webkit.launch();
    } else {
        browser = await chromium.launch();
    }

    // Create a new context
    context = await browser.newContext();

    // Open a new page
    page = await context.newPage();
});

test('Customer CheckOut', async () => {
  test.setTimeout(config.highTimeout);

  try {
    const log = await logIn(page);

    if (log == null) {
      return;
    }

    const cart = await addToCart(page);

    if (cart == null) {
      return;
    }

    console.log('Customer CheckOut');

    await page.click('.icon-cart');

    const exists = await page.waitForSelector('.icon-plus.cursor-pointer', { timeout: 2000 }).catch(() => null);

    if (!exists) {
      console.log('No any item in cart');
      return;
    } else {
      await page.goto(`${baseUrl}/checkout/onepage`);
    }

    const existsbill = await page.waitForSelector('input[name="billing.company_name"]', { timeout: 20000 }).catch(() => null);

    if (existsbill) {
      if (await address(page) != 'done') {
        return;
      }
    }

    const iconExists = await page.waitForSelector('input[name="billing.id"]', { timeout: 20000 }).catch(() => null);

    const radio = await page.$$('input[name="billing.id"]');

    const addressNames = await page.$$('.icon-checkout-address + div p');

    const index = Math.floor(Math.random() * ((radio.length - 1) - 0 + 1)) + 0;

    if (
      index >= 0
      && index < radio.length
    ) {
      await addressNames[index].click();
    } else {
      console.log('Invalid selection.');
      return;
    }

    const checkbox = await page.$$('input[name="billing.use_for_shipping"]');

    if (Math.floor(Math.random() * 20) % 3 == 1 ? false : true) {
      if (!checkbox[0].isChecked()) {
        await page.click('input[name="billing.use_for_shipping"] + label');
      }
    } else {
      if (checkbox[0].isChecked()) {
        await page.click('input[name="billing.use_for_shipping"] + label');
      }

      const radio = await page.$$('input[name="shipping.id"]');

      const index = Math.floor(Math.random() * ((radio.length - 1) - 0 + 1)) + 0;

      if (
        index >= 0
        && index < radio.length
      ) {
        await radio[index].click();
      } else {
        console.log('Invalid selection.');

        return;
      }
    }

    const nextButton = await page.$$('button.primary-button:visible');
    await nextButton[0].click();

    const existsship = await page.waitForSelector('input[name="shipping_method"] + label', { timeout: 10000 }).catch(() => null);

    if (existsship) {
      const radio = await page.$$('input[name="shipping_method"] + label');

      const index = Math.floor(Math.random() * ((radio.length - 1) - 0 + 1)) + 0;

      if (
        index >= 0
        && index < radio.length
      ) {
        await radio[index].click();
      } else {
        console.log('Invalid selection.');
        return;
      }
    }

    const existspay = await page.waitForSelector('input[name="payment[method]"] + label', { timeout: 10000 }).catch(() => null);

    if (existspay) {
      const radio = await page.$$('input[name="payment[method]"] + label');
      const methods = await page.$$('input[name="payment[method]"] + label + label > div');

      const index = Math.floor(Math.random() * ((radio.length - 1) - 0 + 1));

      if (
        index >= 0
        && index < radio.length
      ) {
        await radio[index].click();

        const nextButton = await page.$$('button.primary-button');
        await nextButton[nextButton.length - 1].click();
        const Checked = await forms.testForm(page);

        if (Checked) {
          console.log(Checked);
        } else {
          page.waitForNavigation();

          if (page.url() == `${baseUrl}/onepage/success`) {
            console.log(`Order success`);
          } else {
            console.log(page.url());
          }
        }
      } else {
        console.log('Invalid selection.');

        return;
      }
    }
  } catch (error) {
    console.error('Error during test execution:', error.message);
  }
});

test('Guest CheckOut', async () => {
  test.setTimeout(config.highTimeout);

  try {
    const cart = await addToCart(page);

    await page.goto(`${baseUrl}`);

    const isExists = await page.waitForSelector('.secondary-button.w-full.max-w-full.text-sm.font-medium', { timeout: 20000 }).catch(() => null);

    if (isExists) {
      const buttons = await page.$$('.secondary-button.w-full.max-w-full.text-sm.font-medium');

      if (buttons.length === 0) {
        console.log('No "Add To Cart" buttons found.');
        return null;
      }

      const index = Math.floor(Math.random() * ((buttons.length - 1) - 0 + 1)) + 0;

      await buttons[0].click();

      const iconExist1 = await page.waitForSelector('.break-words + .icon-cancel', { timeout: 10000 }).catch(() => null);

      if (iconExist1) {
        const icons = await page.$$('.break-words + .icon-cancel');

        const message = await icons[0].evaluate(el => el.parentNode.innerText);
        console.log(message);
        await icons[0].click();

        return message;
      }
      await buttons[1].click();

      const iconExist2 = await page.waitForSelector('.break-words + .icon-cancel', { timeout: 10000 }).catch(() => null);

      if (iconExist2) {
        const icons = await page.$$('.break-words + .icon-cancel');

        const message = await icons[0].evaluate(el => el.parentNode.innerText);
        console.log(message);
        await icons[0].click();

        return message;
      }
      await buttons[2].click();

      const iconExist3 = await page.waitForSelector('.break-words + .icon-cancel', { timeout: 10000 }).catch(() => null);

      if (iconExist3) {
        const icons = await page.$$('.break-words + .icon-cancel');

        const message = await icons[0].evaluate(el => el.parentNode.innerText);
        console.log(message);
        await icons[0].click();

        return message;
      }
    }

    console.log('Guest CheckOut');

    await page.goto(`${baseUrl}`);

    await page.click('.icon-cart');

    const exists = await page.waitForSelector('.icon-plus.cursor-pointer', { timeout: 2000 }).catch(() => null);

    if (!exists) {
      console.log('No any item in cart');

      return;
    } else {
      await page.goto(`${baseUrl}/checkout/onepage`);
      await page.waitForNavigation({ timeout: 20000 }).catch(() => null);

      if (! page.url().includes('onepage')) {
        throw new Error('Guest Checkout not allowed on products in cart');
      }
    }

    const existsbill = await page.waitForSelector('input[name="billing.company_name"]', { timeout: 20000 }).catch(() => null);

    if (existsbill) {
      if (await address(page) != 'done') {
        return;
      }
    }

    const existsship = await page.waitForSelector('input[name="shipping_method"] + label', { timeout: 10000 }).catch(() => null);

    if (existsship) {
      const radio = await page.$$('input[name="shipping_method"] + label');

      const index = Math.floor(Math.random() * ((radio.length - 1) - 0 + 1)) + 0;

      if (
        index >= 0
        && index < radio.length
      ) {
        await radio[index].click();
      } else {
        console.log('Invalid selection.');
        return;
      }
    }

    const existspay = await page.waitForSelector('input[name="payment[method]"] + label', { timeout: 10000 }).catch(() => null);

    if (existspay) {
      const radio = await page.$$('input[name="payment[method]"] + label');
      const methods = await page.$$('input[name="payment[method]"] + label + label > div');

      const index = Math.floor(Math.random() * ((radio.length - 1) - 0 + 1));

      if (
        index >= 0
        && index < radio.length
      ) {
        await radio[index].click();

        const nextButton = await page.$$('button.primary-button');
        await nextButton[nextButton.length - 1].click();
        const Checked = await forms.testForm(page);

        if (Checked) {
          console.log(Checked);
        } else {
          page.waitForNavigation();

          if (page.url() == `${baseUrl}/onepage/success`) {
            console.log(`Order success`);
          } else {
            console.log(page.url());
          }
        }
      } else {
        console.log('Invalid selection.');

        return;
      }
    }
  } catch (error) {
    console.error('Error during test execution:', error.message);
  }
});

// Clean up after all tests
test.afterAll(async () => {
    await page.close();
    await context.close();
    await browser.close();
});
