import { test } from '@playwright/test';
import config from '../../Config/config';
import addToCart from '../../Helpers/shop/cartHelper';
import logIn from '../../Helpers/shop/loginHelper';
import address from '../../Helpers/shop/addressHelper';
import * as forms from '../../Helpers/shop/formHelper';

const baseUrl = config.baseUrl;

test('Customer CheckOut', async () => {
  test.setTimeout(config.highTimeout);
  const { chromium, firefox, webkit } = require('playwright');

  var browser;

  if (config.browser == 'firefox') {
    browser = await firefox.launch();
  } else if (config.browser == 'webkit') {
    browser = await webkit.launch();
  } else {
    browser = await chromium.launch();
  }

  const context = await browser.newContext({
    recordVideo: {
      dir: 'videos/',
      size: { width: 1280, height: 720 }
    }
  });
  const page = await context.newPage();

  try {
    const log = await logIn(page);

    if (log == null) {
      return;
    }

    const cart = await addToCart(page);

    if (cart == null) {
      return;
    }

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

      console.log('Select a Payment Method:');

      for (let index = 0; index < radio.length; index++) {
        const method = await methods[index].evaluate(el => (el as HTMLElement).innerText);
        console.log(`${index + 1}: Method- ${method}`);
      }

      const index = Math.floor(Math.random() * ((radio.length - 1) - 0 + 1));

      if (
        index >= 0
        && index < radio.length
      ) {
        await radio[index].click();
        console.log(`Selected Method ${methods[index + 1].evaluate(el => (el as HTMLElement).innerText)}`);

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
    console.log('Error during test execution:', error.message);
  } finally {
    await page.close();
    await context.close();
    await browser.close();
  }
});

test('Guest CheckOut', async () => {
  test.setTimeout(config.highTimeout);
  const { chromium, firefox, webkit } = require('playwright');

  var browser;

  if (config.browser == 'firefox') {
    browser = await firefox.launch();
  } else if (config.browser == 'webkit') {
    browser = await webkit.launch();
  } else {
    browser = await chromium.launch();
  }

  const context = await browser.newContext({
    recordVideo: {
      dir: 'videos/',
      size: { width: 1280, height: 720 }
    }
  });

  const page = await context.newPage();

  try {
    const cart = await addToCart(page);

    if (cart == null) {
      return;
    }

    await page.click('.icon-cart');

    const exists = await page.waitForSelector('.icon-plus.cursor-pointer', { timeout: 2000 }).catch(() => null);

    if (!exists) {
      console.log('No any item in cart');

      return;
    } else {
      await page.goto(`${baseUrl}/checkout/onepage`);
      page.waitForNavigation()

      if (page.url().includes('/login')) {
        console.log('Guest Checkout not allowed on products in cart');
        return;
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

      console.log('Select a Payment Method:');

      for (let index = 0; index < radio.length; index++) {
        const method = await methods[index].evaluate(el => (el as HTMLElement).innerText);
        console.log(`${index + 1}: Method- ${method}`);
      }

      const index = Math.floor(Math.random() * ((radio.length - 1) - 0 + 1));

      if (
        index >= 0
        && index < radio.length
      ) {
        await radio[index].click();
        console.log(`Selected Method ${methods[index + 1]}`);

        const nextButton = await page.$$('button.primary-button');
        await nextButton[nextButton.length - 1].click();
        const Checked = await forms.testForm(page);

        if (Checked) {
          console.log(Checked);
        } else {
          page.waitForNavigation()

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
    console.log('Error during test execution:', error.message);
  } finally {
    await page.close();
    await context.close();
    await browser.close();
  }
});