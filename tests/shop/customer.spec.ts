import { test } from '@playwright/test';
import config from '../../Config/config';
import logIn from '../../Helpers/shop/loginHelper';
import * as readlineSync from 'readline-sync';
import * as forms from '../../Helpers/shop/formHelper';
import * as path from 'path';
import * as fs from 'fs';

const baseUrl = config.baseUrl;

function getRandomDate(start, end) {
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString().split('T')[0];
}

const { chromium, firefox, webkit } = require('playwright');

test('Profile Edit', async () => {
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

        await page.goto(`${baseUrl}/customer/account/profile`);

        await page.click('.secondary-button.border-zinc-200.px-5.py-3.font-normal');

        const exists = await page.waitForSelector('.icon-camera.text-3xl', { timeout: 5000 }).catch(() => null);

        if (exists) {
            await page.click('.icon-camera.text-3xl');
        } else {
            await page.click('.icon-bin.cursor-pointer.text-2xl.text-black');
            await page.click('.icon-camera.text-3xl');
        }

        const userInput = config.userInput;

        const filePath = forms.getRandomImageFile();
        await page.setInputFiles('input[type="file"][name="image[]"]', userInput ? readlineSync.question('Enter the Path ex -> path/to/your/file.png: ') : filePath);

        const startDate = new Date(1950, 0, 1);
        const endDate = new Date(2020, 0, 1);

        await page.fill('input[name="first_name"]', userInput ? readlineSync.question('Enter the First Name: ') : forms.form.firstName);
        await page.fill('input[name="last_name"]', userInput ? readlineSync.question('Enter the Last Name: ') : forms.form.lastName);
        await page.fill('input[name="email"]', userInput ? readlineSync.question('Enter the Email: ') : forms.form.email);
        await page.fill('input[name="phone"]', userInput ? readlineSync.question('Enter the Contact Number: ') : forms.form.phone);
        await page.fill('input[name="date_of_birth"]', userInput ? readlineSync.question('Enter the Date of Birth: ') : getRandomDate(startDate, endDate));
        await page.selectOption('select[name="gender"]', 'Male');

        await page.press('input[name="new_password_confirmation"]', 'Enter');

        const iconExists = await page.waitForSelector('.break-words + .icon-cancel', { timeout: 10000 }).catch(() => null);
        var message = '';

        if (iconExists) {
            const icons = await page.$$('.break-words + .icon-cancel');

            message = await icons[0].evaluate(el => el.parentNode.innerText);
            await icons[0].click();

            console.log(message);
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
    } catch (error) {
        console.log('Error during test execution:', error.message);
    } finally {
        await page.close();
        await context.close();
        await browser.close();
    }
});

test('Change Password', async () => {
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

        await page.goto(`${baseUrl}/customer/account/profile`);

        await page.click('.secondary-button.border-zinc-200.px-5.py-3.font-normal');

        const userInput = config.userInput;
        const phoneValue = await page.inputValue('input[name="phone"]');

        if (phoneValue === '') {
            await page.fill('input[name="phone"]', userInput ? readlineSync.question('Enter the Contact Number: ') : forms.form.phone);
        }

        const selectValue = await page.inputValue('select[name="gender"]');

        if (selectValue === '') {
            await page.selectOption('select[name="gender"]', 'Male');
        }

        await page.fill('input[name="current_password"]', userInput ? readlineSync.question('Enter the Password: ') : config.customerPassword);

        const pass = userInput ? readlineSync.question('Enter the Password: ') : forms.generateRandomPassword(8, 20);

        await page.fill('input[name="new_password"]', pass);
        await page.fill('input[name="new_password_confirmation"]', pass);

        await page.press('input[name="new_password_confirmation"]', 'Enter');

        const iconExists = await page.waitForSelector('.break-words + .icon-cancel', { timeout: 10000 }).catch(() => null);
        var message = '';

        if (iconExists) {
            const icons = await page.$$('.break-words + .icon-cancel');

            message = await icons[0].evaluate(el => el.parentNode.innerText);
            await icons[0].click();

            console.log(message);
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
    } catch (error) {
        console.log('Error during test execution:', error.message);
    } finally {
        await page.close();
        await context.close();
        await browser.close();
    }
});

test('Delete Profile', async () => {
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

        await page.goto(`${baseUrl}/customer/account/profile`);

        await page.click('.primary-button.rounded-2xl.px-11.py-3');

        const userInput = config.userInput;

        await page.fill('input[name="password"]', userInput ? readlineSync.question('Enter the Password: ') : config.customerPassword);

        await page.press('input[name="password"]', 'Enter');

        const iconExists = await page.waitForSelector('.break-words + .icon-cancel', { timeout: 10000 }).catch(() => null);
        var message = '';

        if (iconExists) {
            const icons = await page.$$('.break-words + .icon-cancel');

            message = await icons[0].evaluate(el => el.parentNode.innerText);
            await icons[0].click();

            console.log(message);
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
    } catch (error) {
        console.log('Error during test execution:', error.message);
    } finally {
        await page.close();
        await context.close();
        await browser.close();
    }
});

test('Add Address', async () => {
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

        await page.goto(`${baseUrl}/customer/account/addresses`);

        await page.click('.secondary-button.border-zinc-200.px-5.py-3.font-normal');

        const userInput = config.userInput;

        await page.fill('input[name="company_name"]', userInput ? readlineSync.question('Enter the Company Name: ') : forms.form.lastName);
        await page.fill('input[name="first_name"]', userInput ? readlineSync.question('Enter the First Name: ') : forms.form.firstName);
        await page.fill('input[name="last_name"]', userInput ? readlineSync.question('Enter the Last Name: ') : forms.form.lastName);
        await page.fill('input[name="email"]', userInput ? readlineSync.question('Enter the Email: ') : forms.form.email);
        await page.fill('input[name="address[]"]', userInput ? readlineSync.question('Enter the address: ') : forms.form.firstName);
        await page.selectOption('select[name="country"]', 'IN');
        await page.selectOption('select[name="state"]', 'UP');
        await page.fill('input[name="city"]', userInput ? readlineSync.question('Enter the City Name: ') : forms.form.lastName);
        await page.fill('input[name="postcode"]', '201301');
        await page.fill('input[name="phone"]', userInput ? readlineSync.question('Enter the Contact Number: ') : forms.form.phone);

        await page.click('.icon-uncheck');
        await page.press('input[name="phone"]', 'Enter');

        const iconExists = await page.waitForSelector('.break-words + .icon-cancel', { timeout: 10000 }).catch(() => null);
        var message = '';

        if (iconExists) {
            const icons = await page.$$('.break-words + .icon-cancel');

            message = await icons[0].evaluate(el => el.parentNode.innerText);
            await icons[0].click();

            console.log(message);
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
    } catch (error) {
        console.log('Error during test execution:', error.message);
    } finally {
        await page.close();
        await context.close();
        await browser.close();
    }
});

test('Edit Address', async () => {
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

        await page.goto(`${baseUrl}/customer/account/addresses`);

        const addExists = await page.waitForSelector('.icon-more.cursor-pointer.rounded-md.py-1.text-2xl.text-zinc-500.transition-all', { timeout: 10000 }).catch(() => null);

        if (addExists) {
            const icon = await page.$$('.icon-more.cursor-pointer.rounded-md.py-1.text-2xl.text-zinc-500.transition-all');

            await icon[Math.floor(Math.random() * ((icon.length - 1) - 0 + 1)) + 0].click();

            const buttons = await page.$$('.cursor-pointer.px-5.py-2.text-base:visible');
            await buttons[0].click();

            const userInput = config.userInput;

            await page.fill('input[name="company_name"]', userInput ? readlineSync.question('Enter the Company Name: ') : forms.form.lastName);
            await page.fill('input[name="first_name"]', userInput ? readlineSync.question('Enter the First Name: ') : forms.form.firstName);
            await page.fill('input[name="last_name"]', userInput ? readlineSync.question('Enter the Last Name: ') : forms.form.lastName);
            await page.fill('input[name="email"]', userInput ? readlineSync.question('Enter the Email: ') : forms.form.email);
            await page.fill('input[name="address[]"]', userInput ? readlineSync.question('Enter the address: ') : forms.form.firstName);
            await page.selectOption('select[name="country"]', 'IN');
            await page.selectOption('select[name="state"]', 'UP');
            await page.fill('input[name="city"]', userInput ? readlineSync.question('Enter the City Name: ') : forms.form.lastName);
            await page.fill('input[name="postcode"]', '201301');
            await page.fill('input[name="phone"]', userInput ? readlineSync.question('Enter the Contact Number: ') : forms.form.phone);

            await page.press('input[name="phone"]', 'Enter');

            const iconExists = await page.waitForSelector('.break-words + .icon-cancel', { timeout: 10000 }).catch(() => null);
            var message = '';

            if (iconExists) {
                const icons = await page.$$('.break-words + .icon-cancel');

                message = await icons[0].evaluate(el => el.parentNode.innerText);
                await icons[0].click();

                console.log(message);
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
        } else {
            console.log('No address found. Add new!');
        }
    } catch (error) {
        console.log('Error during test execution:', error.message);
    } finally {
        await page.close();
        await context.close();
        await browser.close();
    }
});

test('Delete Address', async () => {
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

        await page.goto(`${baseUrl}/customer/account/addresses`);

        const addExists = await page.waitForSelector('.icon-more.cursor-pointer.rounded-md.py-1.text-2xl.text-zinc-500.transition-all', { timeout: 10000 }).catch(() => null);

        if (addExists) {
            const icon = await page.$$('.icon-more.cursor-pointer.rounded-md.py-1.text-2xl.text-zinc-500.transition-all');

            await icon[Math.floor(Math.random() * ((icon.length - 1) - 0 + 1)) + 0].click();

            const buttons = await page.$$('.cursor-pointer.px-5.py-2.text-base:visible');
            await buttons[1].click();

            await page.click('.primary-button:visible');

            const iconExists = await page.waitForSelector('.break-words + .icon-cancel', { timeout: 10000 }).catch(() => null);
            var message = '';

            if (iconExists) {
                const icons = await page.$$('.break-words + .icon-cancel');

                message = await icons[0].evaluate(el => el.parentNode.innerText);
                await icons[0].click();

                console.log(message);
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
        } else {
            console.log('No address found. Add new!');
        }
    } catch (error) {
        console.log('Error during test execution:', error.message);
    } finally {
        await page.close();
        await context.close();
        await browser.close();
    }
});

test('Default Address', async () => {
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

        await page.goto(`${baseUrl}/customer/account/addresses`);

        const addExists = await page.waitForSelector('.icon-more.cursor-pointer.rounded-md.py-1.text-2xl.text-zinc-500.transition-all', { timeout: 10000 }).catch(() => null);

        if (addExists) {
            const icon = await page.$$('.icon-more.cursor-pointer.rounded-md.py-1.text-2xl.text-zinc-500.transition-all');

            await icon[Math.floor(Math.random() * ((icon.length - 1) - 0 + 1)) + 0].click();

            const buttons = await page.$$('.cursor-pointer.px-5.py-2.text-base:visible');

            if (buttons.length > 2) {
                await buttons[2].click();

                await page.click('.primary-button:visible');

                console.log('Address set as default address');

            } else {
                console.log('The selected address is allready default');
            }
        } else {
            console.log('No address found. Add new!');
        }
    } catch (error) {
        console.log('Error during test execution:', error.message);
    } finally {
        await page.close();
        await context.close();
        await browser.close();
    }
});

test('View Order', async () => {
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

        await page.goto(`${baseUrl}/customer/account/orders`);

        const addExists = await page.waitForSelector('.float-right.cursor-pointer.rounded-md.text-2xl.transition-all.icon-eye', { timeout: 10000 }).catch(() => null);

        if (addExists) {
            const icon = await page.$$('.float-right.cursor-pointer.rounded-md.text-2xl.transition-all.icon-eye');

            await icon[Math.floor(Math.random() * ((icon.length - 1) - 0 + 1)) + 0].click();

            const addExists = await page.waitForSelector('.mx-4.flex-auto >.mt-8', { timeout: 10000 }).catch(() => null);

            if (addExists) {
                const section = await page.$('#main');

                if (section) {
                    const ordersDir = path.join(__dirname, '../orders');

                    if (! fs.existsSync(ordersDir)) {
                        fs.mkdirSync(ordersDir);
                    }

                    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                    const screenshotName = `order-print-${timestamp}.png`;
                    const screenshotPath = path.join(ordersDir, screenshotName);

                    await section.screenshot({ path: screenshotPath });
                    console.log('Printed the section as ' + screenshotName);
                }
            }
        } else {
            console.log('No Order found. Add new!');
        }
    } catch (error) {
        console.log('Error during test execution:', error.message);
    } finally {
        await page.close();
        await context.close();
        await browser.close();
    }
});

test('Reorder', async () => {
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

        await page.goto(`${baseUrl}/customer/account/orders`);

        const addExists = await page.waitForSelector('.float-right.cursor-pointer.rounded-md.text-2xl.transition-all.icon-eye', { timeout: 10000 }).catch(() => null);

        if (addExists) {
            const icon = await page.$$('.float-right.cursor-pointer.rounded-md.text-2xl.transition-all.icon-eye');

            await icon[Math.floor(Math.random() * ((icon.length - 1) - 0 + 1)) + 0].click();

            const addExists = await page.waitForSelector('.mx-4.flex-auto >.mt-8', { timeout: 10000 }).catch(() => null);

            if (addExists) {
                const icon = await page.$$('.flex > a.secondary-button.border-zinc-200.px-5.py-3.font-normal');

                await icon[0].click();

                const iconExists = await page.waitForSelector('.break-words + .icon-cancel', { timeout: 10000 }).catch(() => null);
                var message = '';

                if (iconExists) {
                    const icons = await page.$$('.break-words + .icon-cancel');

                    message = await icons[0].evaluate(el => el.parentNode.innerText);
                    await icons[0].click();

                    console.log(message);
                } else {
                    console.log('Added to cart for reorder ' + page.url());
                }
            }
        } else {
            console.log('No Order found. Add new!');
        }
    } catch (error) {
        console.log('Error during test execution:', error.message);
    } finally {
        await page.close();
        await context.close();
        await browser.close();
    }
});

test('Cancel Order', async () => {
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

        await page.goto(`${baseUrl}/customer/account/orders`);

        const addExists = await page.waitForSelector('.float-right.cursor-pointer.rounded-md.text-2xl.transition-all.icon-eye', { timeout: 10000 }).catch(() => null);

        if (addExists) {
            const icon = await page.$$('.float-right.cursor-pointer.rounded-md.text-2xl.transition-all.icon-eye');

            await icon[Math.floor(Math.random() * ((icon.length - 1) - 0 + 1)) + 0].click();

            const addExists = await page.waitForSelector('.mx-4.flex-auto >.mt-8', { timeout: 10000 }).catch(() => null);

            if (addExists) {
                const icon = await page.$$('.flex > a.secondary-button.border-zinc-200.px-5.py-3.font-normal');

                if (icon.length > 1) {
                    await icon[icon.length - 1].click();

                    await page.click('.primary-button:visible');

                    const iconExists = await page.waitForSelector('.break-words + .icon-cancel', { timeout: 10000 }).catch(() => null);
                    var message = '';

                    if (iconExists) {
                        const icons = await page.$$('.break-words + .icon-cancel');

                        message = await icons[0].evaluate(el => el.parentNode.innerText);
                        await icons[0].click();

                        console.log(message);
                    }
                } else {
                    console.log('This order can not be Canceled');
                }
            }
        } else {
            console.log('No Order found. Add new!');
        }
    } catch (error) {
        console.log('Error during test execution:', error.message);
    } finally {
        await page.close();
        await context.close();
        await browser.close();
    }
});

test('Print Invoice', async () => {
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

        await page.goto(`${baseUrl}/customer/account/orders`);

        const addExists = await page.waitForSelector('.float-right.cursor-pointer.rounded-md.text-2xl.transition-all.icon-eye', { timeout: 10000 }).catch(() => null);

        if (addExists) {
            const icon = await page.$$('.float-right.cursor-pointer.rounded-md.text-2xl.transition-all.icon-eye');

            await icon[Math.floor(Math.random() * ((icon.length - 1) - 0 + 1)) + 0].click();

            const addExists = await page.waitForSelector('.mx-4.flex-auto >.mt-8', { timeout: 10000 }).catch(() => null);

            if (addExists) {
                const icon = await page.$$('.flex.flex-row.justify-center.gap-8.bg-zinc-100 > #undefined-button');
                console.log(icon.length);

                if (icon.length > 1) {
                    await icon[1].click();
                    const print = await page.waitForSelector('.flex.items-center.gap-1.font-semibold > .icon-download.text-2xl', { timeout: 1000 }).catch(() => null);

                    if (print) {
                        await page.click('.flex.items-center.gap-1.font-semibold > .icon-download.text-2xl');

                        console.log('Invoice Printed');
                    } else {
                        console.log('Invoice not be created by admin for this product');
                    }
                } else {
                    console.log('Invoice not be created by admin for this product');
                }
            }
        } else {
            console.log('No Order found. Add new!');
        }
    } catch (error) {
        console.log('Error during test execution:', error.message);
    } finally {
        await page.close();
        await context.close();
        await browser.close();
    }
});

test('View Shipment', async () => {
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

        await page.goto(`${baseUrl}/customer/account/orders`);

        const addExists = await page.waitForSelector('.float-right.cursor-pointer.rounded-md.text-2xl.transition-all.icon-eye', { timeout: 10000 }).catch(() => null);

        if (addExists) {
            const icon = await page.$$('.float-right.cursor-pointer.rounded-md.text-2xl.transition-all.icon-eye');

            await icon[Math.floor(Math.random() * ((icon.length - 1) - 0 + 1)) + 0].click();

            const addExists = await page.waitForSelector('.mx-4.flex-auto >.mt-8', { timeout: 10000 }).catch(() => null);

            if (addExists) {
                const icon = await page.$$('.flex.flex-row.justify-center.gap-8.bg-zinc-100 > #undefined-button');
                console.log(icon.length);

                if (icon.length > 1) {
                    await icon[1].click();
                    const print = await page.waitForSelector('.flex.items-center.gap-1.font-semibold > .icon-download.text-2xl', { timeout: 1000 }).catch(() => null);

                    if (! print) {
                        const addExists = await page.waitForSelector('.mx-4.flex-auto >.mt-8', { timeout: 10000 }).catch(() => null);

                        if (addExists) {
                            const section = await page.$('#main');

                            if (section) {
                                const shippmentsDir = path.join(__dirname, '../shippments');
                                if (! fs.existsSync(shippmentsDir)) {
                                    fs.mkdirSync(shippmentsDir);
                                }

                                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                                const screenshotName = `shippment-print-${timestamp}.png`;
                                const screenshotPath = path.join(shippmentsDir, screenshotName);

                                await section.screenshot({ path: screenshotPath });
                                console.log('Printed the section as ' + screenshotName);
                            }
                        }
                    } else if (icon.length > 2) {
                        await icon[2].click();

                        const refund = await page.waitForSelector('.mt-8.flex.items-start.gap-10 >.flex.flex-auto.justify-end >.grid.max-w-max.gap-2.text-sm', { timeout: 1000 }).catch(() => null);

                        if (! refund) {
                            const addExists = await page.waitForSelector('.mx-4.flex-auto >.mt-8', { timeout: 10000 }).catch(() => null);

                            if (addExists) {
                                const section = await page.$('#main');

                                if (section) {
                                    const shippmentsDir = path.join(__dirname, '../shippments');

                                    if (! fs.existsSync(shippmentsDir)) {
                                        fs.mkdirSync(shippmentsDir);
                                    }

                                    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                                    const screenshotName = `shippment-print-${timestamp}.png`;
                                    const screenshotPath = path.join(shippmentsDir, screenshotName);

                                    await section.screenshot({ path: screenshotPath });
                                    console.log('Printed the section as ' + screenshotName);
                                }
                            }
                        } else {
                            console.log('Shipment not be created by admin for this product');
                        }
                    }
                } else {
                    console.log('Shipment not be created by admin for this product');
                }
            }
        } else {
            console.log('No Order found. Add new!');
        }
    } catch (error) {
        console.log('Error during test execution:', error.message);
    } finally {
        await page.close();
        await context.close();
        await browser.close();
    }
});

test('Downloadable Orders', async () => {
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

        await page.goto(`${baseUrl}/customer/account/downloadable-products`);

        const addExists = await page.waitForSelector('.row.grid.items-center.border-b.bg-white.px-6.py-4.font-medium.text-gray-600.transition-all > p', { timeout: 10000 }).catch(() => null);

        if (addExists) {
            const icon = await page.$$('.row.grid.items-center.border-b.bg-white.px-6.py-4.font-medium.text-gray-600.transition-all > p > a');

            if (icon.length > 0) {
                await icon[Math.floor(Math.random() * ((icon.length - 1) - 0 + 1)) + 0].click();

                const iconExists = await page.waitForSelector('.break-words + .icon-cancel', { timeout: 10000 }).catch(() => null);
                var message = '';

                if (iconExists) {
                    const icons = await page.$$('.break-words + .icon-cancel');

                    message = await icons[0].evaluate(el => el.parentNode.innerText);
                    await icons[0].click();

                    console.log(message);
                } else {
                    console.log('Downloaded Successfully.');
                }
            } else {
                console.log('All Downloadable Products are pending or expired.');
            }
        } else {
            console.log('No any Downloadable Product Ordered. Add new!');
        }
    } catch (error) {
        console.log('Error during test execution:', error.message);
    } finally {
        await page.close();
        await context.close();
        await browser.close();
    }
});

test('Reviews', async () => {
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

        await page.goto(`${baseUrl}/customer/account/profile/reviews`);

        const addExists = await page.waitForSelector('.icon-star-fill.text-3xl.text-amber-500', { timeout: 10000 }).catch(() => null);

        if (addExists) {
            const section = await page.$('#main');

            if (section) {
                const reviewsDir = path.join(__dirname, '../reviews');

                if (! fs.existsSync(reviewsDir)) {
                    fs.mkdirSync(reviewsDir);
                }

                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const screenshotName = `review-print-${timestamp}.png`;
                const screenshotPath = path.join(reviewsDir, screenshotName);

                await section.screenshot({ path: screenshotPath });
                console.log('Printed the section as ' + screenshotName);
            }
        } else {
            console.log('You have not reviewed any product yet');
        }
    } catch (error) {
        console.log('Error during test execution:', error.message);
    } finally {
        await page.close();
        await context.close();
        await browser.close();
    }
});

test('Wishlist to Cart', async () => {
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

        await page.goto(`${baseUrl}/customer/wishlist`);

        const addExists = await page.waitForSelector('.icon-plus.cursor-pointer.text-2xl:visible', { timeout: 10000 }).catch(() => null);

        if (addExists) {
            const icon = await page.$$('.icon-plus.cursor-pointer.text-2xl:visible');
            const rand = Math.floor(Math.random() * ((10 - 1) - 1 + 1)) + 1;
            const index = Math.floor(Math.random() * ((icon.length - 1) - 0 + 1)) + 0;

            for (let i = 1; i < rand; i++) {
                await icon[index].click();
            }

            const buttons = await page.$$('.primary-button.max-h-10.w-max.rounded-2xl.px-6.text-center.text-base:visible');
            await buttons[index].click();

            const iconExists = await page.waitForSelector('.break-words + .icon-cancel', { timeout: 10000 }).catch(() => null);
            var message = '';

            if (iconExists) {
                const icons = await page.$$('.break-words + .icon-cancel');

                message = await icons[0].evaluate(el => el.parentNode.innerText);
                await icons[0].click();

                console.log(message);
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
        } else {
            console.log('No product found to move. Add new!');
        }
    } catch (error) {
        console.log('Error during test execution:', error.message);
    } finally {
        await page.close();
        await context.close();
        await browser.close();
    }
});

test('Remove from Wishlist', async () => {
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

        await page.goto(`${baseUrl}/customer/wishlist`);

        const addExists = await page.waitForSelector('a.flex.cursor-pointer.justify-end.text-base.text-blue-700:visible', { timeout: 10000 }).catch(() => null);

        if (addExists) {
            const icon = await page.$$('a.flex.cursor-pointer.justify-end.text-base.text-blue-700:visible');
            const index = Math.floor(Math.random() * ((icon.length - 1) - 0 + 1)) + 0;

            await icon[index].click();

            await page.click('.primary-button:visible');

            const iconExists = await page.waitForSelector('.break-words + .icon-cancel', { timeout: 10000 }).catch(() => null);
            var message = '';

            if (iconExists) {
                const icons = await page.$$('.break-words + .icon-cancel');

                message = await icons[0].evaluate(el => el.parentNode.innerText);
                await icons[0].click();

                console.log(message);
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
        } else {
            console.log('No product found to remove. Add new!');
        }
    } catch (error) {
        console.log('Error during test execution:', error.message);
    } finally {
        await page.close();
        await context.close();
        await browser.close();
    }
});

test('Clear Wishlist', async () => {
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

        await page.goto(`${baseUrl}/customer/wishlist`);

        const addExists = await page.waitForSelector('a.flex.cursor-pointer.justify-end.text-base.text-blue-700:visible', { timeout: 10000 }).catch(() => null);

        if (addExists) {
            await page.click('.secondary-button.border-zinc-200.px-5.py-3.font-normal:visible');

            await page.click('.primary-button:visible');

            const iconExists = await page.waitForSelector('.break-words + .icon-cancel', { timeout: 10000 }).catch(() => null);
            var message = '';

            if (iconExists) {
                const icons = await page.$$('.break-words + .icon-cancel');

                message = await icons[0].evaluate(el => el.parentNode.innerText);
                await icons[0].click();

                console.log(message);
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
        } else {
            console.log('No product found to remove. Add new!');
        }
    } catch (error) {
        console.log('Error during test execution:', error.message);
    } finally {
        await page.close();
        await context.close();
        await browser.close();
    }
});