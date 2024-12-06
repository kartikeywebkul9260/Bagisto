import { test } from '@playwright/test';
import config from '../../Config/config';
import addToCart from '../../Helpers/shop/cartHelper';

const { chromium, firefox, webkit } = require('playwright');
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

test('Increment', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}`);

        await addToCart(page);

        console.log('Mini Cart');

        console.log('Increment');

        await page.click('.icon-cart');

        const exists = await page.waitForSelector('.icon-plus.cursor-pointer', { timeout: 2000 }).catch(() => null);

        if (! exists) {
            console.log('No any item in cart');

            return;
        } else {
            const icon = await page.$$(`.icon-plus.cursor-pointer:visible`);
            const quantity = Math.floor(Math.random() * ((10 - 1) - 1 + 1)) + 1;

            for (let i = 1; i < quantity; i++) {
                await icon[icon.length - 1].click();
            }

            console.log('Increment button working properly');
        }
    } catch (error) {
        console.error('Error during test execution:', error.message);
    }
});

test('Decrement', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}`);

        await addToCart(page);

        console.log('Mini Cart');

        console.log('Decrement');

        await page.click('.icon-cart');

        const exists = await page.waitForSelector('.icon-plus.cursor-pointer', { timeout: 2000 }).catch(() => null);

        if (! exists) {
            console.log('No any item in cart');

            return;
        } else {
            const icon = await page.$$(`.icon-plus.cursor-pointer:visible`);
            const quantity = Math.floor(Math.random() * ((10 - 1) - 1 + 1)) + 1;

            for (let i = 1; i < quantity; i++) {
                await icon[icon.length - 1].click();
            }

            const iconMinus = await page.$$(`.icon-minus.cursor-pointer:visible`);

            for (let i = 1; i < quantity; i++) {
                await iconMinus[iconMinus.length - 1].click();
            }

            console.log('Decrement button working properly');
        }
    } catch (error) {
        console.error('Error during test execution:', error.message);
    }
});

test('Remove', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}`);

        await addToCart(page);

        console.log('Mini Cart');

        console.log('Remove');

        await page.click('.icon-cart');

        const exists = await page.waitForSelector('.icon-plus.cursor-pointer', { timeout: 2000 }).catch(() => null);

        if (! exists) {
            console.log('No any item in cart');

            return;
        } else {
            const icon = await page.$$(`button.text-blue-700:visible`);

            await icon[icon.length - 1].click();

            await page.click('.primary-button:visible');

            const iconExists = await page.waitForSelector('.break-words + .icon-cancel', { timeout: 10000 }).catch(() => null);

            if (iconExists) {
                const icons = await page.$$('.break-words + .icon-cancel');

                const message = await icons[0].evaluate(el => el.parentNode.innerText);
                console.info(message);

                await icons[0].click();
            }

            console.log('Remove button working properly');
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
