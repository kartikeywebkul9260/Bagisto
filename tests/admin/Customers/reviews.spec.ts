import { test } from '@playwright/test';
import logIn from '../../../Helpers/admin/loginHelper';
import mode from '../../../Helpers/admin/modeHelper';
import config from '../../../Config/config';

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
            dir: 'videos/admin/Customers/reviews/',
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

    await mode(page); // Set the desired mode after login
});


test('Update Status of Review', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/customers/reviews`);

        console.log('Update Status of Review');

        await page.waitForSelector('div#not_available', { timeout: 5000 }).catch(() => null);

        const iconRight = await page.$$('span[class="icon-sort-right rtl:icon-sort-left cursor-pointer rounded-md p-1.5 text-2xl transition-all hover:bg-gray-200 dark:hover:bg-gray-800 ltr:ml-1 rtl:mr-1"]');

        if (iconRight.length > 0) {
            await iconRight[Math.floor(Math.random() * ((iconRight.length - 1) - 0 + 1)) + 0].click();

            await page.waitForSelector('select.custom-select:visible');
            const select = await page.$('select.custom-select:visible');

            let i = Math.floor(Math.random() * 10) + 1;

            if (i % 3 == 1) {
                const options = await select.$$eval('option', (options) => {
                    return options.map(option => option.value);
                });

                if (options.length > 0) {
                    const randomIndex = Math.floor(Math.random() * options.length);

                    await select.selectOption(options[randomIndex]);
                }
            }

            await page.click('button[class="primary-button ltr:mr-11 rtl:ml-11"]:visible');

            const iconExists = await page.waitForSelector('.flex.items-center.break-all.text-sm > .icon-toast-done.rounded-full.bg-white.text-2xl');

            if (iconExists) {
                const messages = await page.$$('.flex.items-center.break-all.text-sm > .icon-toast-done.rounded-full.bg-white.text-2xl');
                const icons = await page.$$('.flex.items-center.break-all.text-sm + .cursor-pointer.underline');

                const message = await messages[0].evaluate(el => el.parentNode.innerText);
                await icons[0].click();
                console.log(message);
            } else {
                console.log('Status Updated');
            }
        } else {
            console.log('No review found, create first.');
        }
    } catch (error) {
        console.log('Error during test execution:', error.message);
    }
});

test('Delete Review', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/customers/reviews`);

        console.log('Delete Review');

        await page.waitForSelector('div#not_available', { timeout: 5000 }).catch(() => null);

        const iconDelete = await page.$$('span[class="icon-delete cursor-pointer rounded-md p-1.5 text-2xl transition-all hover:bg-gray-200 dark:hover:bg-gray-800 ltr:ml-1 rtl:mr-1"]');

        if (iconDelete.length > 0) {
            await iconDelete[Math.floor(Math.random() * ((iconDelete.length - 1) - 0 + 1)) + 0].click();

            await page.click('button.transparent-button + button.primary-button:visible');

            const iconExists = await page.waitForSelector('.flex.items-center.break-all.text-sm > .icon-toast-done.rounded-full.bg-white.text-2xl');

            if (iconExists) {
                const messages = await page.$$('.flex.items-center.break-all.text-sm > .icon-toast-done.rounded-full.bg-white.text-2xl');
                const icons = await page.$$('.flex.items-center.break-all.text-sm + .cursor-pointer.underline');

                const message = await messages[0].evaluate(el => el.parentNode.innerText);
                await icons[0].click();
                console.log(message);
            }
        } else {
            console.log('No review found, create first.');
        }
    } catch (error) {
        console.log('Error during test execution:', error.message);
    }
});

test('Mass Delete Reviews', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/customers/reviews`);

        console.log('Mass Delete Reviews');

        await page.waitForSelector('div#not_available', { timeout: 5000 }).catch(() => null);

        const checkboxs = await page.$$('.icon-uncheckbox');

        if (checkboxs.length > 0) {
            for (let checkbox of checkboxs) {
                let i = Math.floor(Math.random() * 10) + 1;

                if (i % 3 == 1) {
                    await checkbox.click();
                }
            }

            const button = await page.waitForSelector('button[class="inline-flex w-full max-w-max cursor-pointer appearance-none items-center justify-between gap-x-2 rounded-md border bg-white px-2.5 py-1.5 text-center leading-6 text-gray-600 transition-all marker:shadow hover:border-gray-400 focus:border-gray-400 focus:ring-black dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-400 dark:focus:border-gray-400"]:visible', { timeout: 1000 }).catch(() => null);

            if (button) {
                await page.click('button[class="inline-flex w-full max-w-max cursor-pointer appearance-none items-center justify-between gap-x-2 rounded-md border bg-white px-2.5 py-1.5 text-center leading-6 text-gray-600 transition-all marker:shadow hover:border-gray-400 focus:border-gray-400 focus:ring-black dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-400 dark:focus:border-gray-400"]:visible');
                await page.click('a[class="whitespace-no-wrap flex gap-1.5 rounded-b px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-950"]:visible');

                await page.click('button.transparent-button + button.primary-button:visible');

                const iconExists = await page.waitForSelector('.flex.items-center.break-all.text-sm > .icon-toast-done.rounded-full.bg-white.text-2xl');

                if (iconExists) {
                    const messages = await page.$$('.flex.items-center.break-all.text-sm > .icon-toast-done.rounded-full.bg-white.text-2xl');
                    const icons = await page.$$('.flex.items-center.break-all.text-sm + .cursor-pointer.underline');

                    const message = await messages[0].evaluate(el => el.parentNode.innerText);
                    await icons[0].click();
                    console.log(message);
                }
            } else {
                console.log('Please select any review.');
            }
        } else {
            console.log('No review found, create first.');
        }
    } catch (error) {
        console.log('Error during test execution:', error.message);
    }
});

test('Mass Update Reviews', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/customers/reviews`);

        console.log('Mass Update Review');

        await page.waitForSelector('div#not_available', { timeout: 5000 }).catch(() => null);

        const checkboxs = await page.$$('.icon-uncheckbox');

        if (checkboxs.length > 0) {
            for (let checkbox of checkboxs) {
                let i = Math.floor(Math.random() * 10) + 1;

                if (i % 3 == 1) {
                    await checkbox.click();
                }
            }
            const button = await page.waitForSelector('button[class="inline-flex w-full max-w-max cursor-pointer appearance-none items-center justify-between gap-x-2 rounded-md border bg-white px-2.5 py-1.5 text-center leading-6 text-gray-600 transition-all marker:shadow hover:border-gray-400 focus:border-gray-400 focus:ring-black dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-400 dark:focus:border-gray-400"]:visible', { timeout: 1000 }).catch(() => null);

            if (button) {
                await page.click('button[class="inline-flex w-full max-w-max cursor-pointer appearance-none items-center justify-between gap-x-2 rounded-md border bg-white px-2.5 py-1.5 text-center leading-6 text-gray-600 transition-all marker:shadow hover:border-gray-400 focus:border-gray-400 focus:ring-black dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-400 dark:focus:border-gray-400"]:visible');
                await page.hover('a[class="whitespace-no-wrap flex cursor-not-allowed justify-between gap-1.5 rounded-t px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-950"]:visible');

                const buttons = await page.$$('a[class="whitespace-no-wrap block rounded-t px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-950"]:visible');

                await buttons[Math.floor(Math.random() * ((buttons.length - 1) - 0 + 1)) + 0].click();

                await page.click('button.transparent-button + button.primary-button:visible');

                const iconExists = await page.waitForSelector('.flex.items-center.break-all.text-sm > .icon-toast-done.rounded-full.bg-white.text-2xl');

                if (iconExists) {
                    const messages = await page.$$('.flex.items-center.break-all.text-sm > .icon-toast-done.rounded-full.bg-white.text-2xl');
                    const icons = await page.$$('.flex.items-center.break-all.text-sm + .cursor-pointer.underline');

                    const message = await messages[0].evaluate(el => el.parentNode.innerText);
                    await icons[0].click();
                    console.log(message);
                }
            } else {
                console.log('Please select any review.');
            }
        } else {
            console.log('No review found, create first.');
        }
    } catch (error) {
        console.log('Error during test execution:', error.message);
    }
});
