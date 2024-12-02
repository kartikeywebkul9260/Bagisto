import { test } from '@playwright/test';
import logIn from '../../../Helpers/admin/loginHelper';
import mode from '../../../Helpers/admin/modeHelper';
import config from '../../../Config/config';
import * as forms from '../../../Helpers/admin/formHelper';

const baseUrl = config.baseUrl;

const { chromium, firefox, webkit } = require('playwright');

test('Create Users', async () => {
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

        await page.goto(`${baseUrl}/admin/settings/users`);

        await mode(page);

        await page.click('button[type="button"].primary-button:visible');

        await page.click('select[name="role_id"]');

        const select = await page.$('select[name="role_id"]');

        const options = await select.$$eval('option', (options) => {
            return options.map(option => option.value);
        });

        if (options.length > 1) {
            const randomIndex = Math.floor(Math.random() * (options.length - 1)) + 1;

            await select.selectOption(options[randomIndex]);
            console.log(options[randomIndex]);
        } else {
            await select.selectOption(options[0]);
        }

        await page.fill('input[name="name"]', forms.generateRandomStringWithSpaces(200));

        await page.fill('input[type="email"].rounded-md:visible', forms.form.email);

        const password = forms.generateRandomPassword(8, 20);

        await page.fill('input[name="password"].rounded-md:visible', password);

        await page.fill('input[name="password_confirmation"].rounded-md:visible', password);

        let i = Math.floor(Math.random() * 10) + 1;

        if (i % 2 == 1) {
            await page.click('input[type="checkbox"] + label.peer');
        }

        await page.$eval('label[class="mb-1.5 flex items-center gap-1 text-xs font-medium text-gray-800 dark:text-white required"]', (el, content) => {
            el.innerHTML += content;
        }, `<input type="file" name="image[]" accept="image/*">`);

        const image = await page.$('input[type="file"][name="image[]"]');

        const filePath = forms.getRandomImageFile();

        await image.setInputFiles(filePath);

        await page.press('input[name="name"]', 'Enter');

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

test('Edit Users', async () => {
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

        await page.goto(`${baseUrl}/admin/settings/users`);

        await mode(page);

        const iconEdit = await page.$$('span[class="icon-edit cursor-pointer rounded-md p-1.5 text-2xl transition-all hover:bg-gray-200 dark:hover:bg-gray-800 max-sm:place-self-center"]');

        if (iconEdit.length > 0) {
            await iconEdit[Math.floor(Math.random() * ((iconEdit.length - 1) - 0 + 1)) + 0].click();

            await page.click('select[name="role_id"]');

            const select = await page.$('select[name="role_id"]');

            const options = await select.$$eval('option', (options) => {
                return options.map(option => option.value);
            });

            if (options.length > 1) {
                const randomIndex = Math.floor(Math.random() * (options.length - 1)) + 1;

                await select.selectOption(options[randomIndex]);
                console.log(options[randomIndex]);
            } else {
                await select.selectOption(options[0]);
            }

            await page.fill('input[name="name"]', forms.generateRandomStringWithSpaces(200));

            await page.fill('input[type="email"].rounded-md:visible', forms.form.email);

            const password = forms.generateRandomPassword(8, 20);

            await page.fill('input[name="password"].rounded-md:visible', password);

            await page.fill('input[name="password_confirmation"].rounded-md:visible', password);

            let i = Math.floor(Math.random() * 10) + 1;

            if (i % 2 == 1) {
                await page.click('input[type="checkbox"] + label.peer');
            }

            await page.$eval('label[class="mb-1.5 flex items-center gap-1 text-xs font-medium text-gray-800 dark:text-white required"]', (el, content) => {
                el.innerHTML += content;
            }, `<input type="file" name="image[]" accept="image/*">`);

            const image = await page.$('input[type="file"][name="image[]"]');

            const filePath = forms.getRandomImageFile();

            await image.setInputFiles(filePath);

            await page.press('input[name="name"]', 'Enter');

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
            console.log('No  Users found, create first.');
        }
    } catch (error) {
        console.log('Error during test execution:', error.message);
    } finally {
        await page.close();
        await context.close();
        await browser.close();
    }
});

test('Delete Users', async () => {
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

        await page.goto(`${baseUrl}/admin/settings/users`);

        await mode(page);

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
            console.log('No Users found, create first.');
        }
    } catch (error) {
        console.log('Error during test execution:', error.message);
    } finally {
        await page.close();
        await context.close();
        await browser.close();
    }
});