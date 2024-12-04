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
            dir: 'videos/admin/Marketing/promotions/',
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

test('Create Cart Rule', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/marketing/promotions/cart-rules`);

        console.log('Create Cart Rule');

        await page.click('a.primary-button:visible');

        page.hover('select[name="coupon_type"]');

        let i = Math.floor(Math.random() * 10) + 1;

        for (i; i > 0; i--) {
            await page.click('div.secondary-button:visible');
        }

        const selects = await page.$$('select.custom-select:visible');

        for (let select of selects) {
            const options = await select.$$eval('option', (options) => {
                return options.map(option => option.value);
            });

            if (options.length > 1) {
                const randomIndex = Math.floor(Math.random() * (options.length - 1)) + 1;

                await select.selectOption(options[randomIndex]);
            } else {
                await select.selectOption(options[0]);
            }
        }

        const newSelects = await page.$$('select.custom-select:visible');

        const addedSelects = newSelects.filter(newSelect =>
            !selects.includes(newSelect)
        );

        for (let select of addedSelects) {
            const options = await select.$$eval('option', (options) => {
                return options.map(option => option.value);
            });

            if (options.length > 1) {
                const randomIndex = Math.floor(Math.random() * (options.length - 1)) + 1;

                await select.selectOption(options[randomIndex]);
            } else {
                await select.selectOption(options[0]);
            }
        }

        const checkboxs = await page.$$('input[type="checkbox"] + label');

        for (let checkbox of checkboxs) {
            await checkbox.click();
        }

        const inputs = await page.$$('textarea.rounded-md:visible, input[type="text"].rounded-md:visible');

        for (let input of inputs) {
            await input.fill(forms.generateRandomStringWithSpaces(200));
        }

        const time = forms.generateRandomDateTimeRange();

        await page.fill('input[name="starts_from"]', time.from);
        await page.fill('input[name="ends_till"]', time.to);

        for (i; i > 0; i--) {
            if (await page.click('input[name="coupon_qty"]', { timeout: 100 }).catch(() => null)) {
                await page.fill('input[name="coupon_qty"]', (Math.floor(Math.random() * 10000) + 1).toString());

                await page.fill('input[name="coupon_qty"]', (Math.floor(Math.random() * 10000) + 1).toString());

                await page.click('button[type="submit"].primary-button:visible');
            }
        }

        await page.click('button[type="submit"][class="primary-button"]:visible')

        const firstErrors = await page.$$('#discount_amount, input[type="text"].border-red-500, input[type="text"][class="border !border-red-600 hover:border-red-600 w-full rounded-md border px-3 py-2.5 text-sm text-gray-600 transition-all hover:border-gray-400 focus:border-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-400 dark:focus:border-gray-400"]:visible');

        for (let error of firstErrors) {
            await error.fill(forms.generateRandomStringWithSpaces(200));
        }

        if (config.validInputs) {
            const errors = await page.$$('#discount_amount, input[type="text"].border-red-500, input[type="text"][class="border !border-red-600 hover:border-red-600 w-full rounded-md border px-3 py-2.5 text-sm text-gray-600 transition-all hover:border-gray-400 focus:border-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-400 dark:focus:border-gray-400"]:visible');

            for (let error of errors) {
                await error.fill((Math.random() * 10).toString());
            }

            const newErrors = await page.$$('#discount_amount, input[type="text"].border-red-500, input[class="border !border-red-600 hover:border-red-600 w-full rounded-md border px-3 py-2.5 text-sm text-gray-600 transition-all hover:border-gray-400 focus:border-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-400 dark:focus:border-gray-400"]:visible');

            for (let error of newErrors) {
                await error.fill((Math.floor(Math.random() * 10) + 1).toString());
            }
        }

        if (firstErrors.length > 0) {
            await page.click('button[type="submit"][class="primary-button"]:visible')
        }

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

test('Edit Cart Rule', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/marketing/promotions/cart-rules`);

        console.log('Edit Cart Rule');

        await page.waitForSelector('div#not_available', { timeout: 5000 }).catch(() => null);

        const iconEdit = await page.$$('span[class="cursor-pointer rounded-md p-1.5 text-2xl transition-all hover:bg-gray-200 dark:hover:bg-gray-800 max-sm:place-self-center icon-edit"]');

        if (iconEdit.length > 0) {
            await iconEdit[Math.floor(Math.random() * ((iconEdit.length - 1) - 0 + 1)) + 0].click();

            page.hover('select[name="coupon_type"]');

            let i = Math.floor(Math.random() * 10) + 1;

            for (i; i > 0; i--) {
                await page.click('div.secondary-button:visible');
            }

            const selects = await page.$$('select.custom-select:visible');

            for (let select of selects) {
                const options = await select.$$eval('option', (options) => {
                    return options.map(option => option.value);
                });

                if (options.length > 1) {
                    const randomIndex = Math.floor(Math.random() * (options.length - 1)) + 1;

                    await select.selectOption(options[randomIndex]);
                } else {
                    await select.selectOption(options[0]);
                }
            }

            const newSelects = await page.$$('select.custom-select:visible');

            const addedSelects = newSelects.filter(newSelect =>
                !selects.includes(newSelect)
            );

            for (let select of addedSelects) {
                const options = await select.$$eval('option', (options) => {
                    return options.map(option => option.value);
                });

                if (options.length > 1) {
                    const randomIndex = Math.floor(Math.random() * (options.length - 1)) + 1;

                    await select.selectOption(options[randomIndex]);
                } else {
                    await select.selectOption(options[0]);
                }
            }

            const inputs = await page.$$('textarea.rounded-md:visible, input[type="text"].rounded-md:visible');

            for (let input of inputs) {
                await input.fill(forms.generateRandomStringWithSpaces(200));
            }

            const time = forms.generateRandomDateTimeRange();

            await page.fill('input[name="starts_from"]', time.from);
            await page.fill('input[name="ends_till"]', time.to);

            for (i; i > 0; i--) {
                if (await page.click('input[name="coupon_qty"]', { timeout: 100 }).catch(() => null)) {
                    await page.fill('input[name="coupon_qty"]', (Math.floor(Math.random() * 10000) + 1).toString());

                    await page.fill('input[name="coupon_qty"]', (Math.floor(Math.random() * 10000) + 1).toString());

                    await page.click('button[type="submit"].primary-button:visible');
                }
            }

            await page.click('button[type="button"][class="primary-button"]:visible')

            const firstErrors = await page.$$('#discount_amount, input[type="text"].border-red-500, input[type="text"][class="border !border-red-600 hover:border-red-600 w-full rounded-md border px-3 py-2.5 text-sm text-gray-600 transition-all hover:border-gray-400 focus:border-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-400 dark:focus:border-gray-400"]:visible');

            for (let error of firstErrors) {
                await error.fill(forms.generateRandomStringWithSpaces(200));
            }

            if (config.validInputs) {
                const errors = await page.$$('#discount_amount, input[type="text"].border-red-500, input[type="text"][class="border !border-red-600 hover:border-red-600 w-full rounded-md border px-3 py-2.5 text-sm text-gray-600 transition-all hover:border-gray-400 focus:border-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-400 dark:focus:border-gray-400"]:visible');

                for (let error of errors) {
                    await error.fill((Math.random() * 10).toString());
                }

                const newErrors = await page.$$('#discount_amount, input[type="text"].border-red-500, input[class="border !border-red-600 hover:border-red-600 w-full rounded-md border px-3 py-2.5 text-sm text-gray-600 transition-all hover:border-gray-400 focus:border-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-400 dark:focus:border-gray-400"]:visible');

                for (let error of newErrors) {
                    await error.fill((Math.floor(Math.random() * 10) + 1).toString());
                }
            }

            if (firstErrors.length > 0) {
                await page.click('button[type="button"][class="primary-button"]:visible')
            }

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
            console.log('No Cart Rule found, create first.');
        }
    } catch (error) {
        console.log('Error during test execution:', error.message);
    }
});

test('Delete Cart Rule', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/marketing/promotions/cart-rules`);

        console.log('Delete Cart Rule');

        await page.waitForSelector('div#not_available', { timeout: 5000 }).catch(() => null);

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
            console.log('No Cart Rule found, create first.');
        }
    } catch (error) {
        console.log('Error during test execution:', error.message);
    }
});

test('Create Catalog Rule', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/marketing/promotions/catalog-rules`);

        console.log('Create Catalog Rule');

        await page.click('a.primary-button:visible');

        page.click('input[name="name"]');

        let i = Math.floor(Math.random() * 10) + 1;

        for (i; i > 0; i--) {
            await page.click('div.secondary-button:visible');
        }

        const selects = await page.$$('select.custom-select:visible');

        for (let select of selects) {
            const options = await select.$$eval('option', (options) => {
                return options.map(option => option.value);
            });

            if (options.length > 1) {
                const randomIndex = Math.floor(Math.random() * (options.length - 1)) + 1;

                await select.selectOption(options[randomIndex]);
            } else {
                await select.selectOption(options[0]);
            }
        }

        const newSelects = await page.$$('select.custom-select:visible');

        const addedSelects = newSelects.filter(newSelect =>
            !selects.includes(newSelect)
        );

        for (let select of addedSelects) {
            const options = await select.$$eval('option', (options) => {
                return options.map(option => option.value);
            });

            if (options.length > 1) {
                const randomIndex = Math.floor(Math.random() * (options.length - 1)) + 1;

                await select.selectOption(options[randomIndex]);
            } else {
                await select.selectOption(options[0]);
            }
        }

        const checkboxs = await page.$$('input[type="checkbox"] + label');

        for (let checkbox of checkboxs) {
            await checkbox.click();
        }

        const inputs = await page.$$('textarea.rounded-md:visible, input[type="text"].rounded-md:visible');

        for (let input of inputs) {
            await input.fill(forms.generateRandomStringWithSpaces(200));
        }

        const time = forms.generateRandomDateTimeRange();

        await page.fill('input[name="starts_from"]', time.from);
        await page.fill('input[name="ends_till"]', time.to);

        for (i; i > 0; i--) {
            if (await page.click('input[name="coupon_qty"]', { timeout: 100 }).catch(() => null)) {
                await page.fill('input[name="coupon_qty"]', (Math.floor(Math.random() * 10000) + 1).toString());

                await page.fill('input[name="coupon_qty"]', (Math.floor(Math.random() * 10000) + 1).toString());

                await page.click('button[type="submit"].primary-button:visible');
            }
        }

        await page.click('button[type="submit"][class="primary-button"]:visible')

        const firstErrors = await page.$$('#discount_amount, input[type="text"].border-red-500, input[type="text"][class="border !border-red-600 hover:border-red-600 w-full rounded-md border px-3 py-2.5 text-sm text-gray-600 transition-all hover:border-gray-400 focus:border-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-400 dark:focus:border-gray-400"]:visible');

        for (let error of firstErrors) {
            await error.fill(forms.generateRandomStringWithSpaces(200));
        }

        if (config.validInputs) {
            const errors = await page.$$('#discount_amount, input[type="text"].border-red-500, input[type="text"][class="border !border-red-600 hover:border-red-600 w-full rounded-md border px-3 py-2.5 text-sm text-gray-600 transition-all hover:border-gray-400 focus:border-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-400 dark:focus:border-gray-400"]:visible');

            for (let error of errors) {
                await error.fill((Math.random() * 10).toString());
            }

            const newErrors = await page.$$('#discount_amount, input[type="text"].border-red-500, input[class="border !border-red-600 hover:border-red-600 w-full rounded-md border px-3 py-2.5 text-sm text-gray-600 transition-all hover:border-gray-400 focus:border-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-400 dark:focus:border-gray-400"]:visible');

            for (let error of newErrors) {
                await error.fill((Math.floor(Math.random() * 10) + 1).toString());
            }
        }

        if (firstErrors.length > 0) {
            await page.click('button[type="submit"][class="primary-button"]:visible')
        }

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

test('Edit Catalog Rule', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/marketing/promotions/catalog-rules`);

        console.log('Edit Catalog Rule');

        await page.waitForSelector('div#not_available', { timeout: 5000 }).catch(() => null);

        const iconEdit = await page.$$('span[class="cursor-pointer rounded-md p-1.5 text-2xl transition-all hover:bg-gray-200 dark:hover:bg-gray-800 max-sm:place-self-center icon-edit"]');

        if (iconEdit.length > 0) {
            await iconEdit[Math.floor(Math.random() * ((iconEdit.length - 1) - 0 + 1)) + 0].click();

            page.click('input[name="name"]');

            let i = Math.floor(Math.random() * 10) + 1;

            for (i; i > 0; i--) {
                await page.click('div.secondary-button:visible');
            }

            const selects = await page.$$('select.custom-select:visible');

            for (let select of selects) {
                const options = await select.$$eval('option', (options) => {
                    return options.map(option => option.value);
                });

                if (options.length > 1) {
                    const randomIndex = Math.floor(Math.random() * (options.length - 1)) + 1;

                    await select.selectOption(options[randomIndex]);
                } else {
                    await select.selectOption(options[0]);
                }
            }

            const newSelects = await page.$$('select.custom-select:visible');

            const addedSelects = newSelects.filter(newSelect =>
                !selects.includes(newSelect)
            );

            for (let select of addedSelects) {
                const options = await select.$$eval('option', (options) => {
                    return options.map(option => option.value);
                });

                if (options.length > 1) {
                    const randomIndex = Math.floor(Math.random() * (options.length - 1)) + 1;

                    await select.selectOption(options[randomIndex]);
                } else {
                    await select.selectOption(options[0]);
                }
            }

            const inputs = await page.$$('textarea.rounded-md:visible, input[type="text"].rounded-md:visible');

            for (let input of inputs) {
                await input.fill(forms.generateRandomStringWithSpaces(200));
            }

            const time = forms.generateRandomDateTimeRange();

            await page.fill('input[name="starts_from"]', time.from);
            await page.fill('input[name="ends_till"]', time.to);

            for (i; i > 0; i--) {
                if (await page.click('input[name="coupon_qty"]', { timeout: 100 }).catch(() => null)) {
                    await page.fill('input[name="coupon_qty"]', (Math.floor(Math.random() * 10000) + 1).toString());

                    await page.fill('input[name="coupon_qty"]', (Math.floor(Math.random() * 10000) + 1).toString());

                    await page.click('button[type="submit"].primary-button:visible');
                }
            }

            await page.click('button[type="submit"][class="primary-button"]:visible')

            const firstErrors = await page.$$('#discount_amount, input[type="text"].border-red-500, input[type="text"][class="border !border-red-600 hover:border-red-600 w-full rounded-md border px-3 py-2.5 text-sm text-gray-600 transition-all hover:border-gray-400 focus:border-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-400 dark:focus:border-gray-400"]:visible');

            for (let error of firstErrors) {
                await error.fill(forms.generateRandomStringWithSpaces(200));
            }

            if (config.validInputs) {
                const errors = await page.$$('#discount_amount, input[type="text"].border-red-500, input[type="text"][class="border !border-red-600 hover:border-red-600 w-full rounded-md border px-3 py-2.5 text-sm text-gray-600 transition-all hover:border-gray-400 focus:border-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-400 dark:focus:border-gray-400"]:visible');

                for (let error of errors) {
                    await error.fill((Math.random() * 10).toString());
                }

                const newErrors = await page.$$('#discount_amount, input[type="text"].border-red-500, input[class="border !border-red-600 hover:border-red-600 w-full rounded-md border px-3 py-2.5 text-sm text-gray-600 transition-all hover:border-gray-400 focus:border-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-400 dark:focus:border-gray-400"]:visible');

                for (let error of newErrors) {
                    await error.fill((Math.floor(Math.random() * 10) + 1).toString());
                }
            }

            if (firstErrors.length > 0) {
                await page.click('button[type="submit"][class="primary-button"]:visible')
            }

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
            console.log('No Catalog Rule found, create first.');
        }
    } catch (error) {
        console.log('Error during test execution:', error.message);
    }
});

test('Delete Catalog Rule', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/marketing/promotions/catalog-rules`);

        console.log('Delete Catalog Rule');

        await page.waitForSelector('div#not_available', { timeout: 5000 }).catch(() => null);

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
            console.log('No Catalog Rule found, create first.');
        }
    } catch (error) {
        console.log('Error during test execution:', error.message);
    }
});
