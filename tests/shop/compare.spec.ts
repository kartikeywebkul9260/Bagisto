import { test } from '@playwright/test';
import config from '../../Config/config';

const baseUrl = config.baseUrl;

test('Add', async () => {
    test.setTimeout(config.mediumTimeout);
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
        await page.goto(`${baseUrl}`);

        const exists = await page.waitForSelector('div > .icon-compare.cursor-pointer.text-2xl', { timeout: 20000 }).catch(() => null);

        if (exists) {
            const buttons = await page.$$('div > .icon-compare.cursor-pointer.text-2xl');

            if (buttons.length === 0) {
                console.log('No "Add for Compare" buttons found.');

                return;
            }

            const index = Math.floor(Math.random() * ((buttons.length - 1) - 0 + 1)) + 0;

            await buttons[index].click();

            const iconExists = await page.waitForSelector('.break-words + .icon-cancel', { timeout: 10000 }).catch(() => null);

            if (iconExists) {
                const icons = await page.$$('.break-words + .icon-cancel');

                const message = await icons[0].evaluate(el => el.parentNode.innerText);
                console.log(message);

                await icons[0].click();
            }
        } else {
            console.log('No any Compare button exists at this page.');
        }
    } catch (error) {
        console.log('Error during test execution:', error.message);
    } finally {
        await page.close();
        await context.close();
        await browser.close();
    }
});

test('Remove', async () => {
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
        await page.goto(`${baseUrl}`);

        const exists = await page.waitForSelector('div > .icon-compare.cursor-pointer.text-2xl', { timeout: 10000 }).catch(() => null);

        if (exists) {
            for (let i = 1; i < 3; i++) {
                const buttons = await page.$$('div > .icon-compare.cursor-pointer.text-2xl');

                if (buttons.length === 0) {
                    console.log('No "Add for Compare" buttons found.');

                    return;
                }

                const index = Math.floor(Math.random() * ((buttons.length - 1) - 0 + 1)) + 0;

                await buttons[index].click();

                const iconExists = await page.waitForSelector('.break-words + .icon-cancel', { timeout: 10000 }).catch(() => null);

                if (iconExists) {
                    const icons = await page.$$('.break-words + .icon-cancel');

                    const message = await icons[0].evaluate(el => el.parentNode.innerText);
                    console.log(message);

                    await icons[0].click();
                }
            }
        } else {
            console.log('No any Compare button exists at this page.');
        }
        await page.goto(`${baseUrl}/compare`);

        const existsItem = await page.waitForSelector('div > .icon-cancel.absolute.top-5.flex.cursor-pointer.items-center.justify-center.rounded-md.border.border-zinc-200.bg-white.text-2xl', { timeout: 10000 }).catch(() => null);

        if (existsItem) {
            const buttons = await page.$$('div > .icon-cancel.absolute.top-5.flex.cursor-pointer.items-center.justify-center.rounded-md.border.border-zinc-200.bg-white.text-2xl');

            if (buttons.length === 0) {
                console.log('No "Remove from Compare" buttons found.');

                return;
            }

            console.log('Select a button to click:');

            const index = buttons.length - 1;

            await buttons[index].click();
            console.log(`Clicked button ${index + 1}.`);

            await page.click('.primary-button:visible');
            console.log('Removed Successfuly');
        } else {
            console.log('No any product exists at Compare page.');
        }
    } catch (error) {
        console.log('Error during test execution:', error.message);
    } finally {
        await page.close();
        await context.close();
        await browser.close();
    }
});

test('Remove all', async () => {
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
        await page.goto(`${baseUrl}`);

        const exists = await page.waitForSelector('div > .icon-compare.cursor-pointer.text-2xl', { timeout: 10000 }).catch(() => null);

        if (exists) {
            for (let i = 1; i < 3; i++) {
                const buttons = await page.$$('div > .icon-compare.cursor-pointer.text-2xl');

                if (buttons.length === 0) {
                    console.log('No "Add for Compare" buttons found.');

                    return;
                }

                const index = Math.floor(Math.random() * ((buttons.length - 1) - 0 + 1)) + 0;

                await buttons[index].click();

                const iconExists = await page.waitForSelector('.break-words + .icon-cancel', { timeout: 10000 }).catch(() => null);

                if (iconExists) {
                    const icons = await page.$$('.break-words + .icon-cancel');

                    const message = await icons[0].evaluate(el => el.parentNode.innerText);
                    console.log(message);

                    await icons[0].click();
                }
            }
        } else {
            console.log('No any Compare button exists at this page.');
        }
        await page.goto(`${baseUrl}/compare`);

        const existsItem = await page.waitForSelector('div > .icon-cancel.absolute.top-5.flex.cursor-pointer.items-center.justify-center.rounded-md.border.border-zinc-200.bg-white.text-2xl', { timeout: 10000 }).catch(() => null);

        if (existsItem) {
            const buttons = await page.$$('div.secondary-button.flex.items-center.whitespace-nowrap.border-zinc-200.px-5.py-3.font-normal');

            if (buttons.length === 0) {
                console.log('No "Remove from Compare" buttons found.');

                return;
            }

            await buttons[0].click();

            await page.click('.primary-button:visible');
            console.log('Removed all Successfuly');
        } else {
            console.log('No any product exists at Compare page.');
        }
    } catch (error) {
        console.log('Error during test execution:', error.message);
    } finally {
        await page.close();
        await context.close();
        await browser.close();
    }
});
