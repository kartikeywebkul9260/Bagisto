import { test } from '@playwright/test';
import logIn from '../../../Helpers/admin/loginHelper';
import mode from '../../../Helpers/admin/modeHelper';
import config from '../../../Config/config';
import * as forms from '../../../Helpers/admin/formHelper';

const baseUrl = config.baseUrl;

const { chromium, firefox, webkit } = require('playwright');

test('Create Inventory Sources', async () => {
    test.setTimeout(config.mediumTimeout);

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
        const loginResult = await logIn(page);
        if (! loginResult) {
            console.log('Login failed, exiting test.');
            return;
        }

        await page.goto(`${baseUrl}/admin/settings/inventory-sources`);

        await mode(page);

        await page.click('div.primary-button:visible');

        await page.click('select[name="country"]');

        const select = await page.$('select[name="country"]');

        const options = await select.$$eval('option', (options) => {
            return options.map(option => option.value);
        });

        if (options.length > 1) {
            const randomIndex = Math.floor(Math.random() * (options.length - 1)) + 1;

            await select.selectOption(options[randomIndex]);
        } else {
            await select.selectOption(options[0]);
        }

        const state = await page.$('select[name="state"]');

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

        await page.fill('input[type="email"].rounded-md:visible', forms.form.email);

        await page.fill('input[name="contact_number"].rounded-md:visible', forms.form.phone);

        await page.fill('input[name="latitude"].rounded-md:visible', '-' + (Math.random() * 90).toString());

        await page.fill('input[name="longitude"].rounded-md:visible', '-' + (Math.random() * 90).toString());

        await page.fill('input[name="priority"].rounded-md:visible', (Math.random() * 10000).toString());

        const concatenatedNames = Array(5)
            .fill(null)
            .map(() => forms.generateRandomProductName())
            .join(' ')
            .replaceAll(' ', ', -');

        await page.fill('input[name="street"].rounded-md:visible', concatenatedNames);

        await page.fill('input[name="code"].rounded-md:visible', concatenatedNames.replaceAll(', -', ''));

        let i = Math.floor(Math.random() * 10) + 1;

        if (i % 2 == 1) {
            await page.click('input[type="checkbox"] + label.peer');
        }

        await inputs[0].press('Enter');

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
    } finally {
        await page.close();
        await context.close();
        await browser.close();
    }
});

test('Edit Inventory Sources', async () => {
    test.setTimeout(config.mediumTimeout);

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
        const loginResult = await logIn(page);
        if (! loginResult) {
            console.log('Login failed, exiting test.');
            return;
        }

        await page.goto(`${baseUrl}/admin/settings/inventory-sources`);

        await mode(page);

        const iconEdit = await page.$$('span[class="cursor-pointer rounded-md p-1.5 text-2xl transition-all hover:bg-gray-200 dark:hover:bg-gray-800 max-sm:place-self-center icon-edit"]');

        if (iconEdit.length > 0) {
            await iconEdit[Math.floor(Math.random() * ((iconEdit.length - 1) - 0 + 1)) + 0].click();

            await page.click('select[name="country"]');

            const select = await page.$('select[name="country"]');

            const options = await select.$$eval('option', (options) => {
                return options.map(option => option.value);
            });

            if (options.length > 1) {
                const randomIndex = Math.floor(Math.random() * (options.length - 1)) + 1;

                await select.selectOption(options[randomIndex]);
            } else {
                await select.selectOption(options[0]);
            }

            const state = await page.$('select[name="state"]');

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

            await page.fill('input[type="email"].rounded-md:visible', forms.form.email);

            await page.fill('input[name="contact_number"].rounded-md:visible', forms.form.phone);

            await page.fill('input[name="latitude"].rounded-md:visible', '-' + (Math.random() * 90).toString());

            await page.fill('input[name="longitude"].rounded-md:visible', '-' + (Math.random() * 90).toString());

            await page.fill('input[name="priority"].rounded-md:visible', (Math.random() * 10000).toString());

            const concatenatedNames = Array(5)
                .fill(null)
                .map(() => forms.generateRandomProductName())
                .join(' ')
                .replaceAll(' ', ', -');

            await page.fill('input[name="street"].rounded-md:visible', concatenatedNames);

            await page.fill('input[name="code"].rounded-md:visible', concatenatedNames.replaceAll(', -', ''));

            let i = Math.floor(Math.random() * 10) + 1;

            if (i % 2 == 1) {
                await page.click('input[type="checkbox"] + label.peer');
            }

            await inputs[0].press('Enter');

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
            console.log('No  Inventory Sources found, create first.');
        }
    } catch (error) {
        console.log('Error during test execution:', error.message);
    } finally {
        await page.close();
        await context.close();
        await browser.close();
    }
});

test('Delete Inventory Sources', async () => {
    test.setTimeout(config.mediumTimeout);

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

        await page.goto(`${baseUrl}/admin/settings/inventory-sources`);

        await mode(page);

        const iconDelete = await page.$$('span[class="cursor-pointer rounded-md p-1.5 text-2xl transition-all hover:bg-gray-200 dark:hover:bg-gray-800 max-sm:place-self-center icon-delete"]');

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
            console.log('No Inventory Sources found, create first.');
        }
    } catch (error) {
        console.log('Error during test execution:', error.message);
    } finally {
        await page.close();
        await context.close();
        await browser.close();
    }
});