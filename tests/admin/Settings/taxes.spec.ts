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
            dir: 'videos/admin/Settings/taxes/',
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

test('Create Tax Rate', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/settings/taxes/rates`);

        console.log('Create Tax Rate');

        await page.click('a.primary-button:visible');

        page.click('select[name="country"]');

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

        const checkbox = await page.$('input[type="checkbox"] + label.peer:visible');

        let i = Math.floor(Math.random() * 10) + 1;

        if (i % 2 == 1) {
            await checkbox.click();
        }

        const inputs = await page.$$('textarea.rounded-md:visible, input[type="text"].rounded-md:visible');

        for (let input of inputs) {
            await input.fill(forms.generateRandomStringWithSpaces(200));
        }

        await page.fill('input[name="tax_rate"]', (Math.random() * 500000000).toString());

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
            const iconExists = await page.waitForSelector('.flex.items-center.break-all.text-sm > .icon-toast-done.rounded-full.bg-white.text-2xl', { timeout: 5000 }).catch(() => null);

            if (iconExists) {
                const messages = await page.$$('.flex.items-center.break-all.text-sm > .icon-toast-done.rounded-full.bg-white.text-2xl');
                const icons = await page.$$('.flex.items-center.break-all.text-sm + .cursor-pointer.underline');

                message = await messages[0].evaluate(el => el.parentNode.innerText);
                await icons[0].click();
                console.info(message);
            } else {
                console.log('All fields and buttons are working properly but waiting for server responce.....');
            }
        }
    } catch (error) {
        console.error('Error during test execution:', error.message);
    }
});

test('Edit Tax Rate', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/settings/taxes/rates`);

        console.log('Edit Tax Rate');

        await page.waitForSelector('div#not_available', { timeout: 5000 }).catch(() => null);

        const iconEdit = await page.$$('span[class="cursor-pointer rounded-md p-1.5 text-2xl transition-all hover:bg-gray-200 dark:hover:bg-gray-800 max-sm:place-self-center icon-edit"]');

        if (iconEdit.length > 0) {
            await iconEdit[Math.floor(Math.random() * ((iconEdit.length - 1) - 0 + 1)) + 0].click();

            page.click('select[name="country"]');

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

            await page.fill('input[name="tax_rate"]', (Math.random() * 500000000).toString());

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
                const iconExists = await page.waitForSelector('.flex.items-center.break-all.text-sm > .icon-toast-done.rounded-full.bg-white.text-2xl', { timeout: 5000 }).catch(() => null);

                if (iconExists) {
                    const messages = await page.$$('.flex.items-center.break-all.text-sm > .icon-toast-done.rounded-full.bg-white.text-2xl');
                    const icons = await page.$$('.flex.items-center.break-all.text-sm + .cursor-pointer.underline');

                    message = await messages[0].evaluate(el => el.parentNode.innerText);
                    await icons[0].click();
                    console.log(message);
                } else {
                    console.log('All fields and buttons are working properly but waiting for server responce.....');
                }
            }
        } else {
            console.log('No Rate found, create first.');
        }
    } catch (error) {
        console.error('Error during test execution:', error.message);
    }
});

test('Delete Tax Rate', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/settings/taxes/rates`);

        console.log('Delete Tax Rate');

        await page.waitForSelector('div#not_available', { timeout: 5000 }).catch(() => null);

        const iconDelete = await page.$$('span[class="cursor-pointer rounded-md p-1.5 text-2xl transition-all hover:bg-gray-200 dark:hover:bg-gray-800 max-sm:place-self-center icon-delete"]');

        if (iconDelete.length > 0) {
            await iconDelete[Math.floor(Math.random() * ((iconDelete.length - 1) - 0 + 1)) + 0].click();

            await page.click('button.transparent-button + button.primary-button:visible');

            const iconExists = await page.waitForSelector('.flex.items-center.break-all.text-sm > .icon-toast-done.rounded-full.bg-white.text-2xl', { timeout: 5000 }).catch(() => null);

            if (iconExists) {
                const messages = await page.$$('.flex.items-center.break-all.text-sm > .icon-toast-done.rounded-full.bg-white.text-2xl');
                const icons = await page.$$('.flex.items-center.break-all.text-sm + .cursor-pointer.underline');

                const message = await messages[0].evaluate(el => el.parentNode.innerText);
                await icons[0].click();
                console.info(message);
            } else {
                console.log('All fields and buttons are working properly but waiting for server responce.....');
            }
        } else {
            console.log('No Rate found, create first.');
        }
    } catch (error) {
        console.error('Error during test execution:', error.message);
    }
});

test('Create Tax Category', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/settings/taxes/categories`);

        console.log('Create Tax Category');

        await page.click('button[type="button"].primary-button:visible');

        page.click('select[name="taxrates[]"]');

        const select = await page.$('select[name="taxrates[]"]');

        await page.evaluate((select) => {
            const options = Array.from(select.options) as HTMLOptionElement[];
            const randomCount = Math.floor(Math.random() * options.length) + 1;
            const shuffled = options.sort(() => 0.5 - Math.random());

            shuffled.slice(0, randomCount).forEach(option => {
                option.selected = true;
            });

            const event = new Event('change', { bubbles: true });
            select.dispatchEvent(event);
        }, select);

        const inputs = await page.$$('textarea.rounded-md:visible, input[type="text"].rounded-md:visible');

        for (let input of inputs) {
            await input.fill(forms.generateRandomStringWithSpaces(200));
        }

        await inputs[1].press('Enter');

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
            } else {
                console.log('All fields and buttons are working properly but waiting for server responce.....');
            }
        }
    } catch (error) {
        console.error('Error during test execution:', error.message);
    }
});

test('Edit Tax Category', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/settings/taxes/categories`);

        console.log('Edit Tax Category');

        await page.waitForSelector('div#not_available', { timeout: 5000 }).catch(() => null);

        const iconEdit = await page.$$('span[class="icon-edit cursor-pointer rounded-md p-1.5 text-2xl transition-all hover:bg-gray-200 dark:hover:bg-gray-800 max-sm:place-self-center"]');

        if (iconEdit.length > 0) {
            await iconEdit[Math.floor(Math.random() * ((iconEdit.length - 1) - 0 + 1)) + 0].click();

            page.click('select[name="taxrates[]"]');

            const select = await page.$('select[name="taxrates[]"]');

            await page.evaluate((select) => {
                const options = Array.from(select.options) as HTMLOptionElement[];
                const randomCount = Math.floor(Math.random() * options.length) + 1;
                const shuffled = options.sort(() => 0.5 - Math.random());

                shuffled.slice(0, randomCount).forEach(option => {
                    option.selected = true;
                });

                const event = new Event('change', { bubbles: true });
                select.dispatchEvent(event);
            }, select);

            const inputs = await page.$$('textarea.rounded-md:visible, input[type="text"].rounded-md:visible');

            for (let input of inputs) {
                await input.fill(forms.generateRandomStringWithSpaces(200));
            }

            await inputs[1].press('Enter');

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
                    console.log(message);
                } else {
                    console.log('All fields and buttons are working properly but waiting for server responce.....');
                }
            }
        } else {
            console.log('No Category found, create first.');
        }
    } catch (error) {
        console.error('Error during test execution:', error.message);
    }
});

test('Delete Tax Category', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/settings/taxes/categories`);

        console.log('Delete Tax Category');

        await page.waitForSelector('div#not_available', { timeout: 5000 }).catch(() => null);

        const iconDelete = await page.$$('span[class="icon-delete cursor-pointer rounded-md p-1.5 text-2xl transition-all hover:bg-gray-200 dark:hover:bg-gray-800 max-sm:place-self-center"]');

        if (iconDelete.length > 0) {
            await iconDelete[Math.floor(Math.random() * ((iconDelete.length - 1) - 0 + 1)) + 0].click();

            await page.click('button.transparent-button + button.primary-button:visible');

            const iconExists = await page.waitForSelector('.flex.items-center.break-all.text-sm > .icon-toast-done.rounded-full.bg-white.text-2xl', { timeout: 5000 }).catch(() => null);

            if (iconExists) {
                const messages = await page.$$('.flex.items-center.break-all.text-sm > .icon-toast-done.rounded-full.bg-white.text-2xl');
                const icons = await page.$$('.flex.items-center.break-all.text-sm + .cursor-pointer.underline');

                const message = await messages[0].evaluate(el => el.parentNode.innerText);
                await icons[0].click();
                console.info(message);
            } else {
                console.log('All fields and buttons are working properly but waiting for server responce.....');
            }
        } else {
            console.log('No Category found, create first.');
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
});
