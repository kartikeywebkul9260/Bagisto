import { test } from '@playwright/test';
import logIn from '../../../Helpers/admin/loginHelper';
import mode from '../../../Helpers/admin/modeHelper';
import config from '../../../Config/config';
import * as forms from '../../../Helpers/admin/formHelper';

const baseUrl = config.baseUrl;

const { chromium, firefox, webkit } = require('playwright');

test('Settings of Email', async () => {
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

        await page.goto(`${baseUrl}/admin/configuration/emails/configure`);

        await mode(page);

        await page.click('input[type="text"].rounded-md:visible');

        const inputs = await page.$$('input[type="text"].rounded-md:visible');

        let i = 0;

        for (let input of inputs) {
            if (i % 2 == 0) {
                await input.fill(forms.generateRandomStringWithSpaces(50));
            } else {
                await input.fill(forms.form.email);
            }

            i++;
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

test('Notifications of Email', async () => {
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

        await page.goto(`${baseUrl}/admin/configuration/emails/general`);

        await mode(page);

        await page.click('input[type="checkbox"] + div.peer');

        const checkboxs = await page.$$('input[type="checkbox"] + div.peer');

        for (let checkbox of checkboxs) {
            let i = Math.floor(Math.random() * 10) + 1;

            if (i % 2 == 1) {
                await checkbox.click();
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