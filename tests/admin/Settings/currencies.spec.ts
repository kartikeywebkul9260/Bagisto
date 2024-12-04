import { test } from '@playwright/test';
import logIn from '../../../Helpers/admin/loginHelper';
import mode from '../../../Helpers/admin/modeHelper';
import config from '../../../Config/config';
import * as forms from '../../../Helpers/admin/formHelper';

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
            dir: 'videos/admin/Settings/currencies/',
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

// Clean up after all tests
test.afterAll(async () => {
    await page.close();
    await context.close();
    await browser.close();
    console.info('Browser session closed.');
});

test('Create Currency', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/settings/currencies`);

        console.log('Create Currency');

        await page.click('button[type="button"].primary-button:visible');

        await page.fill('input[name="name"]', forms.generateRandomStringWithSpaces(Math.floor(Math.random() * 200)));

        await page.fill('input[name="symbol"]', forms.generateRandomStringWithSpaces(Math.floor(Math.random() * 200)));

        await page.fill('input[name="decimal"]', forms.generateRandomStringWithSpaces(Math.floor(Math.random() * 200)));

        await page.fill('input[name="group_separator"]', forms.generateRandomStringWithSpaces(Math.floor(Math.random() * 200)));

        await page.fill('input[name="decimal_separator"]', forms.generateRandomStringWithSpaces(Math.floor(Math.random() * 200)));

        await page.fill('input[name="code"]', (forms.generateRandomProductName() + forms.generateRandomProductName()).slice(0, 3));

        const select = await page.$('select[name="currency_position"]');

        const options = await select.$$eval('option', (options) => {
            return options.map(option => option.value);
        });

        if (options.length > 1) {
            const randomIndex = Math.floor(Math.random() * (options.length - 1)) + 1;

            await select.selectOption(options[randomIndex]);
        } else {
            await select.selectOption(options[0]);
        }

        await page.press('input[name="code"]', 'Enter');

        const getError = await page.waitForSelector('.text-red-600.text-xs.italic', { timeout: 3000 }).catch(() => null);
        var message = '';

        if (getError) {
            const errors = await page.$$('.text-red-600.text-xs.italic');

            for (let error of errors) {
                message = await error.evaluate(el => el.innerText);
                console.log(message);
            }
        } else {
            const iconExists = await page.waitForSelector('.flex.items-center.break-all.text-sm > .icon-toast-done.rounded-full.bg-white.text-2xl');

            if (iconExists) {
                const messages = await page.$$('.flex.items-center.break-all.text-sm > .icon-toast-done.rounded-full.bg-white.text-2xl');
                const icons = await page.$$('.flex.items-center.break-all.text-sm + .cursor-pointer.underline');

                message = await messages[0].evaluate(el => el.parentNode.innerText);
                await icons[0].click();
                console.log(message);
            }
        }
    } catch (error) {
        console.log('Error during test execution:', error.message);
    }
});

test('Edit Currency', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/settings/currencies`);

        console.log('Edit Currency');

        await page.waitForSelector('div#not_available', { timeout: 5000 }).catch(() => null);

        const iconEdit = await page.$$('span[class="icon-edit cursor-pointer rounded-md p-1.5 text-2xl transition-all hover:bg-gray-200 dark:hover:bg-gray-800 max-sm:place-self-center"]');

        if (iconEdit.length > 0) {
            await iconEdit[Math.floor(Math.random() * ((iconEdit.length - 1) - 0 + 1)) + 0].click();

            await page.fill('input[name="name"]', forms.generateRandomStringWithSpaces(Math.floor(Math.random() * 200)));

            await page.fill('input[name="symbol"]', forms.generateRandomStringWithSpaces(Math.floor(Math.random() * 200)));

            await page.fill('input[name="decimal"]', forms.generateRandomStringWithSpaces(Math.floor(Math.random() * 200)));

            await page.fill('input[name="group_separator"]', forms.generateRandomStringWithSpaces(Math.floor(Math.random() * 200)));

            await page.fill('input[name="decimal_separator"]', forms.generateRandomStringWithSpaces(Math.floor(Math.random() * 200)));

            await page.fill('input[name="code"]', (forms.generateRandomProductName() + forms.generateRandomProductName()).slice(0, 3));

            const select = await page.$('select[name="currency_position"]');

            const options = await select.$$eval('option', (options) => {
                return options.map(option => option.value);
            });

            if (options.length > 1) {
                const randomIndex = Math.floor(Math.random() * (options.length - 1)) + 1;

                await select.selectOption(options[randomIndex]);
            } else {
                await select.selectOption(options[0]);
            }

            await page.press('input[name="code"]', 'Enter');

            const getError = await page.waitForSelector('.text-red-600.text-xs.italic', { timeout: 3000 }).catch(() => null);
            var message = '';

            if (getError) {
                const errors = await page.$$('.text-red-600.text-xs.italic');

                for (let error of errors) {
                    message = await error.evaluate(el => el.innerText);
                    console.log(message);
                }
            } else {
                const iconExists = await page.waitForSelector('.flex.items-center.break-all.text-sm > .icon-toast-done.rounded-full.bg-white.text-2xl');

                if (iconExists) {
                    const messages = await page.$$('.flex.items-center.break-all.text-sm > .icon-toast-done.rounded-full.bg-white.text-2xl');
                    const icons = await page.$$('.flex.items-center.break-all.text-sm + .cursor-pointer.underline');

                    message = await messages[0].evaluate(el => el.parentNode.innerText);
                    await icons[0].click();
                    console.log(message);
                }
            }
        } else {
            console.log('No locale found, create first.');
        }
    } catch (error) {
        console.log('Error during test execution:', error.message);
    }
});

test('Delete Currency', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/settings/currencies`);

        console.log('Delete Currency');

        await page.waitForSelector('div#not_available', { timeout: 5000 }).catch(() => null);
        
        const iconDelete = await page.$$('span[class="icon-delete cursor-pointer rounded-md p-1.5 text-2xl transition-all hover:bg-gray-200 dark:hover:bg-gray-800 max-sm:place-self-center"]');

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
            console.log('No locale found, create first.');
        }
    } catch (error) {
        console.log('Error during test execution:', error.message);
    }
});
