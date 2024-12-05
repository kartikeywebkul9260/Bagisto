import { test, expect } from '@playwright/test';
import config from '../../Config/config';
import logIn from '../../Helpers/shop/loginHelper';
import * as forms from '../../Helpers/shop/formHelper';
import * as readlineSync from 'readline-sync';

const baseUrl = config.baseUrl;

test('Register', async () => {
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
      dir: 'videos/shop/auth',
      size: { width: 1280, height: 720 }
    }
  });
  const page = await context.newPage();

  try {
    const userInput = config.userInput;

    await page.goto(`${baseUrl}/customer/register`);

    await page.fill('input[name="first_name"]', userInput ? readlineSync.question('Enter the First Name: ') : forms.form.firstName);
    await page.fill('input[name="last_name"]', userInput ? readlineSync.question('Enter the Last Name: ') : forms.form.lastName);
    const email = userInput ? readlineSync.question('Enter the Email: ') : forms.form.email;
    await page.fill('input[name="email"]', email);
    const pass = userInput ? readlineSync.question('Enter the Password: ') : forms.generateRandomPassword(8, 20);
    await page.fill('input[name="password"]', pass);
    await page.fill('input[name="password_confirmation"]', pass);

    await page.press('input[name="password_confirmation"]', 'Enter');
    console.log('Email: ' + email + '\nPassword: ' + pass);

    await forms.testForm(page);
  } catch (error) {
    console.error('Error during test execution:', error.message);
  } finally {
    await page.close();
    await context.close();
    await browser.close();
  }
});

test('Login', async () => {
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
      dir: 'videos/shop/auth',
      size: { width: 1280, height: 720 }
    }
  });
  const page = await context.newPage();

  try {
    await logIn(page);
  } catch (error) {
    console.error('Error during test execution:', error.message);
  } finally {
    await page.close();
    await context.close();
    await browser.close();
  }
});

test('Logout', async () => {
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
      dir: 'videos/shop/auth',
      size: { width: 1280, height: 720 }
    }
  });

  const page = await context.newPage();

  try {
    const log = await logIn(page);

    if (log == null) {
      return;
    }

    await page.click('.select-none > .icon-users.inline-block.cursor-pointer.text-2xl');
    await page.click('form + .cursor-pointer.px-5.py-2.text-base:visible');

    await page.click('.select-none > .icon-users.inline-block.cursor-pointer.text-2xl');
    const exists = await page.waitForSelector('.primary-button.m-0.mx-auto.block.w-max.rounded-2xl.px-7.text-center.text-base + .secondary-button.m-0.mx-auto.block.w-max.rounded-2xl.border-2.px-7.text-center.text-base:visible', { timeout: 10000 }).catch(() => null);

    if (exists) {
      console.log('Successfully Loged out');
    } else {
      console.log('Still logedIn');
    }
  } catch (error) {
    console.error('Error during test execution:', error.message);
  } finally {
    await page.close();
    await context.close();
    await browser.close();
  }
});
