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
            dir: 'videos/admin/Configuration/sales/',
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

test('Shipping Settings of Sales', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/configuration/sales/shipping`);

        console.log('Shipping Settings of Sales');

        await page.click('select[name="sales[shipping][origin][country]"]');

        const select = await page.$('select[name="sales[shipping][origin][country]"]');

        const options = await select.$$eval('option', (options) => {
            return options.map(option => option.value);
        });

        if (options.length > 1) {
            const randomIndex = Math.floor(Math.random() * (options.length - 1)) + 1;

            await select.selectOption(options[randomIndex]);
        } else {
            await select.selectOption(options[0]);
        }

        const state = await page.$('select[name="sales[shipping][origin][state]"]');

        if (state) {
            const options = await state.$$eval('option', (options) => {
                return options.map(option => option.value);
            });

            if (options.length > 1) {
                const randomIndex = Math.floor(Math.random() * (options.length - 1)) + 1;

                await state.selectOption(options[randomIndex]);
            } else {
                await select.selectOption(options[0]);
            }
        }

        const inputs = await page.$$('textarea.rounded-md:visible, input[type="text"].rounded-md:visible');

        for (let input of inputs) {
            await input.fill(forms.generateRandomStringWithSpaces(200));
        }

        await page.click('button[type="submit"].primary-button:visible');

        const getError = await page.waitForSelector('.text-red-600.text-xs.italic', { timeout: 3000 }).catch(() => null);
        var message = '';

        if (getError) {
            const errors = await page.$$('.text-red-600.text-xs.italic');

            for (let error of errors) {
                message = await error.evaluate(el => el.innerText);
                console.log(message);
            }
        } else {
            const iconExists = await page.waitForSelector('.flex.items-center.break-all.text-sm > .icon-toast-done.rounded-full.bg-white.text-2xl', { timeout: 5000 }).catch(() => null);

            if (iconExists) {
                const messages = await page.$$('.flex.items-center.break-all.text-sm > .icon-toast-done.rounded-full.bg-white.text-2xl');
                const icons = await page.$$('.flex.items-center.break-all.text-sm + .cursor-pointer.underline');

                message = await messages[0].evaluate(el => el.parentNode.innerText);
                await icons[0].click();
                console.info(message);
            }
        }
    } catch (error) {
        console.error('Error during test execution:', error.message);
    }
});

test('Shipping Methods of Sales', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/configuration/sales/carriers`);

        console.log('Shipping Methods of Sales');

        await page.click('input[type="checkbox"] + div.peer');

        const checkboxs = await page.$$('input[type="checkbox"] + div.peer');

        for (let checkbox of checkboxs) {
            let i = Math.floor(Math.random() * 10) + 1;

            if (i % 2 == 1) {
                await checkbox.click();
            }
        }

        const inputs = await page.$$('textarea.rounded-md:visible, input[type="text"].rounded-md:visible');

        for (let input of inputs) {
            await input.fill(forms.generateRandomStringWithSpaces(200));
        }

        const select = await page.$('select.custom-select');

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

        await page.click('button[type="submit"].primary-button:visible');

        const getError = await page.waitForSelector('.text-red-600.text-xs.italic', { timeout: 3000 }).catch(() => null);
        var message = '';

        if (getError) {
            const errors = await page.$$('.text-red-600.text-xs.italic');

            for (let error of errors) {
                message = await error.evaluate(el => el.innerText);
                console.log(message);
            }
        } else {
            const iconExists = await page.waitForSelector('.flex.items-center.break-all.text-sm > .icon-toast-done.rounded-full.bg-white.text-2xl', { timeout: 5000 }).catch(() => null);

            if (iconExists) {
                const messages = await page.$$('.flex.items-center.break-all.text-sm > .icon-toast-done.rounded-full.bg-white.text-2xl');
                const icons = await page.$$('.flex.items-center.break-all.text-sm + .cursor-pointer.underline');

                message = await messages[0].evaluate(el => el.parentNode.innerText);
                await icons[0].click();
                console.info(message);
            }
        }
    } catch (error) {
        console.error('Error during test execution:', error.message);
    }
});

test('Payment Methods of Sales', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/configuration/sales/payment_methods`);

        console.log('Payment Methods of Sales');

        await page.click('input[type="checkbox"] + div.peer');

        const checkboxs = await page.$$('input[type="checkbox"] + div.peer');

        for (let checkbox of checkboxs) {
            let i = Math.floor(Math.random() * 10) + 1;

            if (i % 2 == 1) {
                await checkbox.click();
            }
        }

        const files = await page.$$('input[type="file"]');

        for (let file of files) {
            let i = Math.floor(Math.random() * 10) + 1;

            if (i % 2 == 1) {
                const filePath = forms.getRandomImageFile();

                await file.setInputFiles(filePath);
            }
        }

        const deletes = await page.$$('input[type="checkbox"] + label.icon-uncheckbox:visible');

        for (let checkbox of deletes) {
            let i = Math.floor(Math.random() * 10) + 1;

            if (i % 2 == 1) {
                await checkbox.click();
            }
        }

        const inputs = await page.$$('textarea.rounded-md:visible, input[type="text"].rounded-md:visible');

        for (let input of inputs) {
            await input.fill(forms.generateRandomStringWithSpaces(200));
        }

        const selects = await page.$$('select.custom-select');

        for (let select of selects) {
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
        }

        await page.click('button[type="submit"].primary-button:visible');

        const getError = await page.waitForSelector('.text-red-600.text-xs.italic', { timeout: 3000 }).catch(() => null);
        var message = '';

        if (getError) {
            const errors = await page.$$('.text-red-600.text-xs.italic');

            for (let error of errors) {
                message = await error.evaluate(el => el.innerText);
                console.log(message);
            }
        } else {
            const iconExists = await page.waitForSelector('.flex.items-center.break-all.text-sm > .icon-toast-done.rounded-full.bg-white.text-2xl', { timeout: 5000 }).catch(() => null);

            if (iconExists) {
                const messages = await page.$$('.flex.items-center.break-all.text-sm > .icon-toast-done.rounded-full.bg-white.text-2xl');
                const icons = await page.$$('.flex.items-center.break-all.text-sm + .cursor-pointer.underline');

                message = await messages[0].evaluate(el => el.parentNode.innerText);
                await icons[0].click();
                console.info(message);
            }
        }
    } catch (error) {
        console.error('Error during test execution:', error.message);
    }
});

test('Order Settings of Sales', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/configuration/sales/order_settings`);

        console.log('Order Settings of Sales');

        await page.click('input[type="checkbox"] + div.peer');

        const checkboxs = await page.$$('input[type="checkbox"] + div.peer');

        for (let checkbox of checkboxs) {
            let i = Math.floor(Math.random() * 10) + 1;

            if (i % 2 == 1) {
                await checkbox.click();
            }
        }

        const inputs = await page.$$('textarea.rounded-md:visible, input[type="text"].rounded-md:visible');

        for (let input of inputs) {
            let i = Math.floor(Math.random() * 10) + 1;

            if (i % 2 == 1) {
                await input.fill(forms.generateRandomStringWithSpaces(200));
            }
        }

        await page.fill('input[name="sales[order_settings][order_number][order_number_length]"]', (Math.floor(Math.random() * 100000000)).toString());
        await page.fill('input[type="number"]', (Math.floor(Math.random() * 1000000)).toString(), { timeout: 3000 }).catch(() => null);

        await page.click('button[type="submit"].primary-button:visible');

        const getError = await page.waitForSelector('.text-red-600.text-xs.italic', { timeout: 3000 }).catch(() => null);
        var message = '';

        if (getError) {
            const errors = await page.$$('.text-red-600.text-xs.italic');

            for (let error of errors) {
                message = await error.evaluate(el => el.innerText);
                console.log(message);
            }
        } else {
            const iconExists = await page.waitForSelector('.flex.items-center.break-all.text-sm > .icon-toast-done.rounded-full.bg-white.text-2xl', { timeout: 5000 }).catch(() => null);

            if (iconExists) {
                const messages = await page.$$('.flex.items-center.break-all.text-sm > .icon-toast-done.rounded-full.bg-white.text-2xl');
                const icons = await page.$$('.flex.items-center.break-all.text-sm + .cursor-pointer.underline');

                message = await messages[0].evaluate(el => el.parentNode.innerText);
                await icons[0].click();
                console.info(message);
            }
        }
    } catch (error) {
        console.error('Error during test execution:', error.message);
    }
});

test('Invoice Settings of Sales', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/configuration/sales/invoice_settings`);

        console.log('Invoice Settings of Sales');

        await page.click('input[type="checkbox"] + div.peer');

        const checkboxs = await page.$$('input[type="checkbox"] + div.peer');

        for (let checkbox of checkboxs) {
            let i = Math.floor(Math.random() * 10) + 1;

            if (i % 2 == 1) {
                await checkbox.click();
            }
        }

        const inputs = await page.$$('textarea.rounded-md:visible, input[type="text"].rounded-md:visible');

        for (let input of inputs) {
            let i = Math.floor(Math.random() * 10) + 1;

            if (i % 2 == 1) {
                await input.fill(forms.generateRandomStringWithSpaces(200));
            }
        }

        const newErrors = await page.$$('input[class="border !border-red-600 hover:border-red-600 w-full rounded-md border px-3 py-2.5 text-sm text-gray-600 transition-all hover:border-gray-400 focus:border-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-400 dark:focus:border-gray-400"]:visible');

        for (let error of newErrors) {
            await error.fill((Math.floor(Math.random() * 1000000000000000)).toString());
        }

        const file = await page.$('input[type="file"]');

        let i = Math.floor(Math.random() * 10) + 1;

        if (i % 2 == 1) {
            const filePath = forms.getRandomImageFile();

            await file.setInputFiles(filePath);
        }

        const select = await page.$('select.custom-select');

        const options = await select.$$eval('option', (options) => {
            return options.map(option => option.value);
        });

        if (options.length > 0) {
            const randomIndex = Math.floor(Math.random() * options.length);

            await select.selectOption(options[randomIndex]);
        }

        await page.click('button[type="submit"].primary-button:visible');

        const getError = await page.waitForSelector('.text-red-600.text-xs.italic', { timeout: 3000 }).catch(() => null);
        var message = '';

        if (getError) {
            const errors = await page.$$('.text-red-600.text-xs.italic');

            for (let error of errors) {
                message = await error.evaluate(el => el.innerText);
                console.log(message);
            }
        } else {
            const iconExists = await page.waitForSelector('.flex.items-center.break-all.text-sm > .icon-toast-done.rounded-full.bg-white.text-2xl', { timeout: 5000 }).catch(() => null);

            if (iconExists) {
                const messages = await page.$$('.flex.items-center.break-all.text-sm > .icon-toast-done.rounded-full.bg-white.text-2xl');
                const icons = await page.$$('.flex.items-center.break-all.text-sm + .cursor-pointer.underline');

                message = await messages[0].evaluate(el => el.parentNode.innerText);
                await icons[0].click();
                console.info(message);
            }
        }
    } catch (error) {
        console.error('Error during test execution:', error.message);
    }
});

test('Taxes of Sales', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/configuration/sales/taxes`);

        console.log('Taxes of Sales');

        await page.click('select.custom-select');

        const selects = await page.$$('select.custom-select');

        for (let select of selects) {
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
        }

        const state = await page.$('select[name="sales[taxes][default_destination_calculation][state]"]');

        if (state) {
            const options = await state.$$eval('option', (options) => {
                return options.map(option => option.value);
            });

            if (options.length > 1) {
                const randomIndex = Math.floor(Math.random() * (options.length - 1)) + 1;

                await state.selectOption(options[randomIndex]);
            } else {
                await state.selectOption(options[0]);
            }
        }

        const inputs = await page.$$('textarea.rounded-md:visible, input[type="text"].rounded-md:visible');

        for (let input of inputs) {
            await input.fill(forms.generateRandomStringWithSpaces(200));
        }

        await page.click('button[type="submit"].primary-button:visible');

        const getError = await page.waitForSelector('.text-red-600.text-xs.italic', { timeout: 3000 }).catch(() => null);
        var message = '';

        if (getError) {
            const errors = await page.$$('.text-red-600.text-xs.italic');

            for (let error of errors) {
                message = await error.evaluate(el => el.innerText);
                console.log(message);
            }
        } else {
            const iconExists = await page.waitForSelector('.flex.items-center.break-all.text-sm > .icon-toast-done.rounded-full.bg-white.text-2xl', { timeout: 5000 }).catch(() => null);

            if (iconExists) {
                const messages = await page.$$('.flex.items-center.break-all.text-sm > .icon-toast-done.rounded-full.bg-white.text-2xl');
                const icons = await page.$$('.flex.items-center.break-all.text-sm + .cursor-pointer.underline');

                message = await messages[0].evaluate(el => el.parentNode.innerText);
                await icons[0].click();
                console.info(message);
            }
        }
    } catch (error) {
        console.error('Error during test execution:', error.message);
    }
});

test('Checkout of Sales', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/configuration/sales/checkout`);

        console.log('Checkout of Sales');

        await page.click('input[type="checkbox"] + div.peer');

        const checkboxs = await page.$$('input[type="checkbox"] + div.peer');

        for (let checkbox of checkboxs) {
            let i = Math.floor(Math.random() * 10) + 1;

            if (i % 2 == 1) {
                await checkbox.click();
            }
        }

        const select = await page.$('select.custom-select');

        const options = await select.$$eval('option', (options) => {
            return options.map(option => option.value);
        });

        if (options.length > 0) {
            const randomIndex = Math.floor(Math.random() * options.length);

            await select.selectOption(options[randomIndex]);
        }

        await page.fill('input[name="sales[checkout][mini_cart][offer_info]"]', forms.generateRandomStringWithSpaces(200));

        await page.click('button[type="submit"].primary-button:visible');

        const getError = await page.waitForSelector('.text-red-600.text-xs.italic', { timeout: 3000 }).catch(() => null);
        var message = '';

        if (getError) {
            const errors = await page.$$('.text-red-600.text-xs.italic');

            for (let error of errors) {
                message = await error.evaluate(el => el.innerText);
                console.log(message);
            }
        } else {
            const iconExists = await page.waitForSelector('.flex.items-center.break-all.text-sm > .icon-toast-done.rounded-full.bg-white.text-2xl', { timeout: 5000 }).catch(() => null);

            if (iconExists) {
                const messages = await page.$$('.flex.items-center.break-all.text-sm > .icon-toast-done.rounded-full.bg-white.text-2xl');
                const icons = await page.$$('.flex.items-center.break-all.text-sm + .cursor-pointer.underline');

                message = await messages[0].evaluate(el => el.parentNode.innerText);
                await icons[0].click();
                console.info(message);
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
    console.info('Browser session closed.');
});
