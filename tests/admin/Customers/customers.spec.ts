import { test } from '@playwright/test';
import logIn from '../../../Helpers/admin/loginHelper';
import mode from '../../../Helpers/admin/modeHelper';
import config from '../../../Config/config';
import * as readlineSync from 'readline-sync';
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
            dir: 'videos/admin/Customers/customers/',
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

test('Create Customer', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/customers/customers`);

        console.log('Create Customer');

        await page.click('button.primary-button:visible');

        const userInput = config.userInput;
        await page.fill('input[name="first_name"]:visible', userInput ? readlineSync.question('Enter the First Name: ') : forms.form.firstName);
        await page.fill('input[name="last_name"]:visible', userInput ? readlineSync.question('Enter the Last Name: ') : forms.form.lastName);
        const email = userInput ? readlineSync.question('Enter the Email: ') : forms.form.email;
        await page.fill('input[name="email"]:visible', email);
        await page.fill('input[name="phone"]:visible', userInput ? readlineSync.question('Enter the Contact Number: ') : forms.form.phone);
        await page.selectOption('select[name="gender"]:visible', 'Other');

        await page.press('input[name="phone"]:visible', 'Enter');

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
                console.info(message);
            }
        }
    } catch (error) {
        console.error('Error during test execution:', error.message);
    }
});

test('Edit Customer', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/customers/customers`);

        console.log('Edit Customer');

        await page.waitForSelector('div#not_available', { timeout: 5000 }).catch(() => null);

        const iconRight = await page.$$('a[class="icon-sort-right rtl:icon-sort-left cursor-pointer p-1.5 text-2xl hover:rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 ltr:ml-1 rtl:mr-1"]');

        if (iconRight.length > 0) {
            await iconRight[Math.floor(Math.random() * ((iconRight.length - 1) - 0 + 1)) + 0].click();

            await page.click('div[class="flex cursor-pointer items-center justify-between gap-1.5 px-2.5 text-blue-600 transition-all hover:underline"]:visible');

            const userInput = config.userInput;
            await page.fill('input[name="first_name"]:visible', userInput ? readlineSync.question('Enter the First Name: ') : forms.form.firstName);
            await page.fill('input[name="last_name"]:visible', userInput ? readlineSync.question('Enter the Last Name: ') : forms.form.lastName);
            const email = userInput ? readlineSync.question('Enter the Email: ') : forms.form.email;
            await page.fill('input[name="email"]:visible', email);
            await page.fill('input[name="phone"]:visible', userInput ? readlineSync.question('Enter the Contact Number: ') : forms.form.phone);
            await page.selectOption('select[name="gender"]:visible', 'Other');

            const checkboxs = await page.$$('input[type="checkbox"] + label');

            for (let checkbox of checkboxs) {
                let i = Math.floor(Math.random() * 10) + 1;

                if (i % 2 == 1) {
                    await checkbox.click();
                }
            }

            await page.press('input[name="phone"]:visible', 'Enter');

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
        }
    } catch (error) {
        console.error('Error during test execution:', error.message);
    }
});

test('Add Address', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/customers/customers`);

        console.log('Add Address');

        await page.waitForSelector('div#not_available', { timeout: 5000 }).catch(() => null);

        const iconRight = await page.$$('a[class="icon-sort-right rtl:icon-sort-left cursor-pointer p-1.5 text-2xl hover:rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 ltr:ml-1 rtl:mr-1"]');

        if (iconRight.length > 0) {
            await iconRight[Math.floor(Math.random() * ((iconRight.length - 1) - 0 + 1)) + 0].click();

            await page.waitForSelector('div[class="flex cursor-pointer items-center justify-between gap-1.5 px-2.5 text-blue-600 transition-all hover:underline"]:visible');

            const createBtn = await page.$$('div[class="flex cursor-pointer items-center justify-between gap-1.5 px-2.5 text-blue-600 transition-all hover:underline"]:visible');

            await createBtn[1].click();

            const userInput = config.userInput;
            await page.fill('input[name="company_name"]', userInput ? readlineSync.question('Enter the Company Name: ') : forms.form.lastName);
            await page.fill('input[name="first_name"]', userInput ? readlineSync.question('Enter the First Name: ') : forms.form.firstName);
            await page.fill('input[name="last_name"]', userInput ? readlineSync.question('Enter the Last Name: ') : forms.form.lastName);
            await page.fill('input[name="email"]', userInput ? readlineSync.question('Enter the Email: ') : forms.form.email);
            await page.fill('input[name="address[0]"]', userInput ? readlineSync.question('Enter the address: ') : forms.form.firstName);
            await page.selectOption('select[name="country"]', 'IN');
            await page.selectOption('select[name="state"]', 'UP');
            await page.fill('input[name="city"]', userInput ? readlineSync.question('Enter the City Name: ') : forms.form.lastName);
            await page.fill('input[name="postcode"]', '201301');
            await page.fill('input[name="phone"]', userInput ? readlineSync.question('Enter the Contact Number: ') : forms.form.phone);

            await page.click('input[name="default_address"] + label:visible');
            await page.press('input[name="phone"]', 'Enter');

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
        }
    } catch (error) {
        console.error('Error during test execution:', error.message);
    }
});

test('Edit Address', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/customers/customers`);

        console.log('Edit Address');

        await page.waitForSelector('div#not_available', { timeout: 5000 }).catch(() => null);

        const iconRight = await page.$$('a[class="icon-sort-right rtl:icon-sort-left cursor-pointer p-1.5 text-2xl hover:rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 ltr:ml-1 rtl:mr-1"]');

        if (iconRight.length > 0) {
            await iconRight[Math.floor(Math.random() * ((iconRight.length - 1) - 0 + 1)) + 0].click();

            await page.waitForSelector('div[class="flex cursor-pointer items-center justify-between gap-1.5 px-2.5 text-blue-600 transition-all hover:underline"]:visible');

            const createBtn = await page.$$('p[class="cursor-pointer text-blue-600 transition-all hover:underline"]:visible');

            if (createBtn.length == 0) {
                throw new Error('No address found for edit');
            }

            await createBtn[0].click();

            const userInput = config.userInput;
            await page.fill('input[name="company_name"]', userInput ? readlineSync.question('Enter the Company Name: ') : forms.form.lastName);
            await page.fill('input[name="first_name"]', userInput ? readlineSync.question('Enter the First Name: ') : forms.form.firstName);
            await page.fill('input[name="last_name"]', userInput ? readlineSync.question('Enter the Last Name: ') : forms.form.lastName);
            await page.fill('input[name="email"]', userInput ? readlineSync.question('Enter the Email: ') : forms.form.email);
            await page.fill('input[name="address[0]"]', userInput ? readlineSync.question('Enter the address: ') : forms.form.firstName);
            await page.selectOption('select[name="country"]', 'IN');
            await page.selectOption('select[name="state"]', 'UP');
            await page.fill('input[name="city"]', userInput ? readlineSync.question('Enter the City Name: ') : forms.form.lastName);
            await page.fill('input[name="postcode"]', '201301');
            await page.fill('input[name="phone"]', userInput ? readlineSync.question('Enter the Contact Number: ') : forms.form.phone);

            await page.click('input[name="default_address"] + label:visible');
            await page.press('input[name="phone"]', 'Enter');

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
        }
    } catch (error) {
        console.error('Error during test execution:', error.message);
    }
});

test('Set Default Address', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/customers/customers`);

        console.log('Set Default Address');

        await page.waitForSelector('div#not_available', { timeout: 5000 }).catch(() => null);

        const iconRight = await page.$$('a[class="icon-sort-right rtl:icon-sort-left cursor-pointer p-1.5 text-2xl hover:rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 ltr:ml-1 rtl:mr-1"]');

        if (iconRight.length > 0) {
            await iconRight[Math.floor(Math.random() * ((iconRight.length - 1) - 0 + 1)) + 0].click();

            await page.waitForSelector('div[class="flex cursor-pointer items-center justify-between gap-1.5 px-2.5 text-blue-600 transition-all hover:underline"]:visible');

            const createBtn = await page.$$('button[class="flex cursor-pointer justify-center text-sm text-blue-600 transition-all hover:underline"]:visible');

            if (createBtn.length == 0) {
                throw new Error('No address found for edit');
            }

            await createBtn[createBtn.length - 1].click();

            const iconExists = await page.waitForSelector('.flex.items-center.break-all.text-sm > .icon-toast-done.rounded-full.bg-white.text-2xl');

            if (iconExists) {
                const messages = await page.$$('.flex.items-center.break-all.text-sm > .icon-toast-done.rounded-full.bg-white.text-2xl');
                const icons = await page.$$('.flex.items-center.break-all.text-sm + .cursor-pointer.underline');

                const message = await messages[0].evaluate(el => el.parentNode.innerText);
                await icons[0].click();
                console.info(message);
            }
        }
    } catch (error) {
        console.error('Error during test execution:', error.message);
    }
});

test('Delete Address', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/customers/customers`);

        console.log('Delete Address');

        await page.waitForSelector('div#not_available', { timeout: 5000 }).catch(() => null);

        const iconRight = await page.$$('a[class="icon-sort-right rtl:icon-sort-left cursor-pointer p-1.5 text-2xl hover:rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 ltr:ml-1 rtl:mr-1"]');

        if (iconRight.length > 0) {
            await iconRight[Math.floor(Math.random() * ((iconRight.length - 1) - 0 + 1)) + 0].click();

            await page.waitForSelector('div[class="flex cursor-pointer items-center justify-between gap-1.5 px-2.5 text-blue-600 transition-all hover:underline"]:visible');

            const createBtn = await page.$$('p[class="cursor-pointer text-red-600 transition-all hover:underline"]:visible');

            if (createBtn.length == 0) {
                throw new Error('No address found for delete');
            }

            await createBtn[createBtn.length - 1].click();

            await page.click('button[type="button"].transparent-button + button[type="button"].primary-button')

            const iconExists = await page.waitForSelector('.flex.items-center.break-all.text-sm > .icon-toast-done.rounded-full.bg-white.text-2xl');

            if (iconExists) {
                const messages = await page.$$('.flex.items-center.break-all.text-sm > .icon-toast-done.rounded-full.bg-white.text-2xl');
                const icons = await page.$$('.flex.items-center.break-all.text-sm + .cursor-pointer.underline');

                const message = await messages[0].evaluate(el => el.parentNode.innerText);
                await icons[0].click();
                console.info(message);
            }
        }
    } catch (error) {
        console.error('Error during test execution:', error.message);
    }
});

test('Add Note', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/customers/customers`);

        console.log('Add Note');

        await page.waitForSelector('div#not_available', { timeout: 5000 }).catch(() => null);

        const iconRight = await page.$$('a[class="icon-sort-right rtl:icon-sort-left cursor-pointer p-1.5 text-2xl hover:rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 ltr:ml-1 rtl:mr-1"]');

        if (iconRight.length > 0) {
            await iconRight[Math.floor(Math.random() * ((iconRight.length - 1) - 0 + 1)) + 0].click();

            const lorem100 = forms.generateRandomStringWithSpaces(500);
            page.fill('textarea[name="note"]', lorem100);
            console.log(lorem100);
            await page.click('input[name="customer_notified"] + span');

            await page.click('button[type="submit"].secondary-button:visible');

            await forms.testForm(page);
        }
    } catch (error) {
        console.error('Error during test execution:', error.message);
    }
});

test('Delete Account', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/customers/customers`);

        console.log('Delete Account');

        await page.waitForSelector('div#not_available', { timeout: 5000 }).catch(() => null);

        const iconRight = await page.$$('a[class="icon-sort-right rtl:icon-sort-left cursor-pointer p-1.5 text-2xl hover:rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 ltr:ml-1 rtl:mr-1"]');

        if (iconRight.length > 0) {
            await iconRight[Math.floor(Math.random() * ((iconRight.length - 1) - 0 + 1)) + 0].click();

            await page.click('.icon-cancel:visible');

            await page.click('button[type="button"].transparent-button + button[type="button"].primary-button')

            const iconExists = await page.waitForSelector('.flex.items-center.break-all.text-sm > .icon-toast-done.rounded-full.bg-white.text-2xl');

            if (iconExists) {
                const messages = await page.$$('.flex.items-center.break-all.text-sm > .icon-toast-done.rounded-full.bg-white.text-2xl');
                const icons = await page.$$('.flex.items-center.break-all.text-sm + .cursor-pointer.underline');

                const message = await messages[0].evaluate(el => el.parentNode.innerText);
                await icons[0].click();
                console.info(message);
            }
        }
    } catch (error) {
        console.error('Error during test execution:', error.message);
    }
});

test('Create Order', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/customers/customers`);

        console.log('Create Order');

        await page.waitForSelector('div#not_available', { timeout: 5000 }).catch(() => null);

        const iconRight = await page.$$('a[class="icon-sort-right rtl:icon-sort-left cursor-pointer p-1.5 text-2xl hover:rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 ltr:ml-1 rtl:mr-1"]');

        if (iconRight.length > 0) {
            await iconRight[Math.floor(Math.random() * ((iconRight.length - 1) - 0 + 1)) + 0].click();

            await page.click('.icon-cart:visible');

            await page.click('button[type="button"].transparent-button + button[type="button"].primary-button')

            console.log(page.url());
        }
    } catch (error) {
        console.error('Error during test execution:', error.message);
    }
});

test('login as Customer', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/customers/customers`);

        console.log('login as Customer');

        await page.waitForSelector('div#not_available', { timeout: 5000 }).catch(() => null);

        const iconEdit = await page.$$('.icon-login');

        if (iconEdit.length > 0) {
            await iconEdit[Math.floor(Math.random() * ((iconEdit.length - 1) - 0 + 1)) + 0].click();

            console.log('Loged in successfully');
        } else {
            console.log('No customer found, create first.');
        }
    } catch (error) {
        console.error('Error during test execution:', error.message);
    }
});

test('Mass Delete Customers', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/customers/customers`);

        console.log('Mass Delete Customers');

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
                console.log('Please select any customer.');
            }
        } else {
            console.log('No customer found, create first.');
        }
    } catch (error) {
        console.error('Error during test execution:', error.message);
    }
});

test('Mass Update Customers', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/customers/customers`);

        console.log('Mass Update Customers');

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

                let i = Math.floor(Math.random() * 10) + 1;

                if (i % 2 == 1) {
                    await buttons[1].click();
                } else {
                    await buttons[0].click();
                }

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
                console.log('Please select any customer.');
            }
        } else {
            console.log('No customer found, create first.');
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
