import { test } from '@playwright/test';
import logIn from '../../Helpers/admin/loginHelper';
import config from '../../Config/config';

test('Login', async () => {
  const { chromium, firefox, webkit } = await import('playwright');

  var browser;

  if (config.browser == 'firefox') {
    browser = await firefox.launch();
  } else if (config.browser == 'webkit') {
    browser = await webkit.launch();
  } else {
    browser = await chromium.launch();
  }

  const context = await browser.newContext();
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
  const { chromium, firefox, webkit } = await import('playwright');

  var browser;

  if (config.browser == 'firefox') {
    browser = await firefox.launch();
  } else if (config.browser == 'webkit') {
    browser = await webkit.launch();
  } else {
    browser = await chromium.launch();
  }

  const context = await browser.newContext();

  const page = await context.newPage();

  try {
    const log = await logIn(page);

    if (log == null) {
      return;
    }

    await page.click('.relative > .flex.select-none > .flex.h-9.w-9.cursor-pointer.items-center.justify-center.rounded-full.bg-blue-400.text-sm.font-semibold.leading-6.text-white.transition-all');
    await page.click('form + .cursor-pointer.px-5.py-2.text-base.text-gray-800:visible');

    const exists = await page.waitForSelector('input[type="email"]', { timeout: 5000 }).catch(() => null);

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
