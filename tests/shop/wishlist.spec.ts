import { test } from '@playwright/test';
import config from '../../Config/config';
import logIn from '../../Helpers/shop/loginHelper';

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
    context = await browser.newContext({
        recordVideo: {
            dir: 'videos/shop/compare/',
            size: { width: 1280, height: 720 }
        }
    });

    // Open a new page
    page = await context.newPage();

    // Log in once
    const log = await logIn(page);
    if (log == null) {
        throw new Error('Login failed. Tests will not proceed.');
    }
});

test('Add To Wishlist', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}`);

        console.log('Add To Wishlist');

        const exists = await page.waitForSelector('.cursor-pointer.text-2xl.icon-heart', { timeout: 20000 }).catch(() => null);

        if (exists) {
            const buttons = await page.$$('.cursor-pointer.text-2xl.icon-heart');

            if (buttons.length === 0) {
                console.log('No "Add To Cart" buttons found.');
            } else {
                await buttons[Math.floor(Math.random() * ((buttons.length - 1) - 0 + 1)) + 0].click();
                const iconExists = await page.waitForSelector('.break-words + .icon-cancel', { timeout: 10000 }).catch(() => null);
                var message = '';

                if (iconExists) {
                    const icons = await page.$$('.break-words + .icon-cancel');

                    message = await icons[0].evaluate(el => el.parentNode.innerText);
                    await icons[0].click();

                    console.log(message);
                    return;
                } else {
                    const getError = await page.waitForSelector('.text-red-500.text-xs.italic', { timeout: 3000 }).catch(() => null);

                    if (getError) {
                        const errors = await page.$$('.text-red-500.text-xs.italic');

                        for (let error of errors) {
                            message = await error.evaluate(el => el.innerText);
                            console.log(message);
                        }
                    }
                }
            }
        } else {
            console.log('No any product found in page.');
        }
    } catch (error) {
        console.error('Error during test execution:', error.message);
    }
});

test('Remove from Wishlist', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}`);

        console.log('Remove To Wishlist');

        const exists = await page.waitForSelector('.cursor-pointer.text-2xl.icon-heart-fill.text-red-600', { timeout: 20000 }).catch(() => null);

        if (exists) {
            const buttons = await page.$$('.cursor-pointer.text-2xl.icon-heart-fill.text-red-600');

            if (buttons.length === 0) {
                console.log('No "Add To Cart" buttons found.');
            } else {
                await buttons[Math.floor(Math.random() * ((buttons.length - 1) - 0 + 1)) + 0].click();
                const iconExists = await page.waitForSelector('.break-words + .icon-cancel', { timeout: 10000 }).catch(() => null);
                var message = '';

                if (iconExists) {
                    const icons = await page.$$('.break-words + .icon-cancel');

                    message = await icons[0].evaluate(el => el.parentNode.innerText);
                    await icons[0].click();

                    console.log(message);
                    return;
                } else {
                    const getError = await page.waitForSelector('.text-red-500.text-xs.italic', { timeout: 3000 }).catch(() => null);

                    if (getError) {
                        const errors = await page.$$('.text-red-500.text-xs.italic');

                        for (let error of errors) {
                            message = await error.evaluate(el => el.innerText);
                            console.log(message);
                        }
                    }
                }
            }
        } else {
            console.log('No any wishlist product found in page.');
        }
    } catch (error) {
        console.error('Error during test execution:', error.message);
    }
});
