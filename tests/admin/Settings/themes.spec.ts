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
            dir: 'videos/admin/Settings/themes/',
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


test('Create Product Carousel Theme', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/settings/themes`);

        console.log('Create Product Carousel Theme');

        await page.click('button[type="button"].primary-button:visible');

        page.click('select.custom-select:visible');

        const selects = await page.$$('select.custom-select:visible');

        for (let select of selects) {
            const options = await select.$$eval('option', (options) => {
                return options.map(option => option.value);
            });

            if (options.length > 0) {
                const randomIndex = Math.floor(Math.random() * options.length);

                await select.selectOption(options[randomIndex]);
            } else {
                await select.selectOption(options[0]);
            }
        }

        await page.selectOption('select[name="type"]', 'product_carousel');

        await page.fill('input[name="sort_order"]', (Math.floor(Math.random() * 1000000)).toString());

        await page.fill('input[name="name"]', forms.generateRandomStringWithSpaces(Math.floor(Math.random() * 100)));

        await page.click('button[type="submit"].primary-button:visible');

        await page.click('input[type="checkbox"] + label.peer:visible');

        const checkbox = await page.$('input[type="checkbox"] + label.peer:visible');

        let i = Math.floor(Math.random() * 10) + 1;

        if (i % 2 == 1) {
            await checkbox.click();
        }

        const inputs = await page.$$('input[type="text"].rounded-md:visible');

        for (let input of inputs) {
            await input.fill(forms.generateRandomStringWithSpaces(200));
        }

        await page.fill('input[name="sort_order"]', (Math.floor(Math.random() * 1000000)).toString());

        const customSelects = await page.$$('select.custom-select:visible');

        for (let select of customSelects) {
            const options = await select.$$eval('option', (options) => {
                return options.map(option => option.value);
            });

            if (options.length > 1) {
                const randomIndex = Math.floor(Math.random() * (options.length - 1) + 1);

                await select.selectOption(options[randomIndex]);
            } else {
                await select.selectOption(options[0]);
            }
        }

        await page.click('div[class="secondary-button"]:visible');

        const key = await page.$('select[name="key"]');

        if (key) {
            const options = await key.$$eval('option', (options) => {
                return options.map(option => option.value);
            });

            if (options.length > 0) {
                const randomIndex = Math.floor(Math.random() * options.length);

                await key.selectOption(options[randomIndex]);
            }
        }

        const value = await page.$('select[name="value"]');

        if (value) {
            const options = await value.$$eval('option', (options) => {
                return options.map(option => option.value);
            });

            if (options.length > 0) {
                const randomIndex = Math.floor(Math.random() * options.length);

                await value.selectOption(options[randomIndex]);
            }
        } else {
            await page.fill('input[name="value"]', forms.generateRandomStringWithSpaces(Math.floor(Math.random() * 100)));
        }

        const errors = await page.$$('input[type="text"][class="border !border-red-600 hover:border-red-600 w-full rounded-md border px-3 py-2.5 text-sm text-gray-600 transition-all hover:border-gray-400 focus:border-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-400 dark:focus:border-gray-400"]:visible');

        for (let error of errors) {
            await error.fill((Math.random() * 10).toString());
        }

        const newErrors = await page.$$('input[class="border !border-red-600 hover:border-red-600 w-full rounded-md border px-3 py-2.5 text-sm text-gray-600 transition-all hover:border-gray-400 focus:border-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-400 dark:focus:border-gray-400"]:visible');

        for (let error of newErrors) {
            await error.fill((Math.floor(Math.random() * 10) + 1).toString());
        }

        await page.click('button[type="submit"][class="cursor-pointer rounded-md border border-blue-700 bg-blue-600 px-3 py-1.5 font-semibold text-gray-50"]:visible');

        const Errors = await page.waitForSelector('.text-red-600.text-xs.italic', { timeout: 3000 }).catch(() => null);

        if (Errors) {
            throw new Error('Selected key have no any option');
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
    }
});

test('Create Category Carousel Theme', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/settings/themes`);

        console.log('Create Category Carousel Theme');

        await page.click('button[type="button"].primary-button:visible');

        page.click('select.custom-select:visible');

        const selects = await page.$$('select.custom-select:visible');

        for (let select of selects) {
            const options = await select.$$eval('option', (options) => {
                return options.map(option => option.value);
            });

            if (options.length > 0) {
                const randomIndex = Math.floor(Math.random() * options.length);

                await select.selectOption(options[randomIndex]);
            } else {
                await select.selectOption(options[0]);
            }
        }

        await page.selectOption('select[name="type"]', 'category_carousel');

        await page.fill('input[name="sort_order"]', (Math.floor(Math.random() * 1000000)).toString());

        await page.fill('input[name="name"]', forms.generateRandomStringWithSpaces(Math.floor(Math.random() * 100)));

        await page.click('button[type="submit"].primary-button:visible');

        await page.click('input[type="checkbox"] + label.peer:visible');

        const checkbox = await page.$('input[type="checkbox"] + label.peer:visible');

        let i = Math.floor(Math.random() * 10) + 1;

        if (i % 2 == 1) {
            await checkbox.click();
        }

        const inputs = await page.$$('input[type="text"].rounded-md:visible');

        for (let input of inputs) {
            await input.fill(forms.generateRandomStringWithSpaces(200));
        }

        await page.fill('input[name="sort_order"]', (Math.floor(Math.random() * 1000000)).toString());
        await page.fill('input[name="en[options][filters][limit]"]', (Math.floor(Math.random() * 1000000)).toString());

        const customSelects = await page.$$('select.custom-select:visible');

        for (let select of customSelects) {
            const options = await select.$$eval('option', (options) => {
                return options.map(option => option.value);
            });

            if (options.length > 1) {
                const randomIndex = Math.floor(Math.random() * (options.length - 1) + 1);

                await select.selectOption(options[randomIndex]);
            } else {
                await select.selectOption(options[0]);
            }
        }

        await page.click('div[class="secondary-button"]:visible');

        const key = await page.$('select[name="key"]');

        if (key) {
            const options = await key.$$eval('option', (options) => {
                return options.map(option => option.value);
            });

            if (options.length > 0) {
                const randomIndex = Math.floor(Math.random() * options.length);

                await key.selectOption(options[randomIndex]);
            }
        }

        const value = await page.$('select[name="value"]');

        if (value) {
            const options = await value.$$eval('option', (options) => {
                return options.map(option => option.value);
            });

            if (options.length > 0) {
                const randomIndex = Math.floor(Math.random() * options.length);

                await value.selectOption(options[randomIndex]);
            }
        } else {
            await page.fill('input[name="value"]', forms.generateRandomStringWithSpaces(Math.floor(Math.random() * 100)));
        }

        const errors = await page.$$('input[type="text"][class="border !border-red-600 hover:border-red-600 w-full rounded-md border px-3 py-2.5 text-sm text-gray-600 transition-all hover:border-gray-400 focus:border-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-400 dark:focus:border-gray-400"]:visible');

        for (let error of errors) {
            await error.fill((Math.random() * 10).toString());
        }

        const newErrors = await page.$$('input[class="border !border-red-600 hover:border-red-600 w-full rounded-md border px-3 py-2.5 text-sm text-gray-600 transition-all hover:border-gray-400 focus:border-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-400 dark:focus:border-gray-400"]:visible');

        for (let error of newErrors) {
            await error.fill((Math.floor(Math.random() * 10) + 1).toString());
        }

        await page.click('button[type="submit"][class="cursor-pointer rounded-md border border-blue-700 bg-blue-600 px-3 py-1.5 font-semibold text-gray-50"]:visible');

        const Errors = await page.waitForSelector('.text-red-600.text-xs.italic', { timeout: 3000 }).catch(() => null);

        if (Errors) {
            throw new Error('Selected key have no any option');
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
    }
});

test('Create Static Content Theme', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/settings/themes`);

        console.log('Create Static Content Theme');

        await page.click('button[type="button"].primary-button:visible');

        page.click('select.custom-select:visible');

        const selects = await page.$$('select.custom-select:visible');

        for (let select of selects) {
            const options = await select.$$eval('option', (options) => {
                return options.map(option => option.value);
            });

            if (options.length > 0) {
                const randomIndex = Math.floor(Math.random() * options.length);

                await select.selectOption(options[randomIndex]);
            } else {
                await select.selectOption(options[0]);
            }
        }

        await page.selectOption('select[name="type"]', 'static_content');

        await page.fill('input[name="sort_order"]', (Math.floor(Math.random() * 1000000)).toString());

        await page.fill('input[name="name"]', forms.generateRandomStringWithSpaces(Math.floor(Math.random() * 100)));

        await page.click('button[type="submit"].primary-button:visible');

        await page.click('input[type="checkbox"] + label.peer:visible');

        const checkbox = await page.$('input[type="checkbox"] + label.peer:visible');

        let i = Math.floor(Math.random() * 10) + 1;

        if (i % 2 == 1) {
            await checkbox.click();
        }

        const randomHtmlContent = await forms.generateRandomStringWithSpaces(Math.floor(Math.random() * 1000));

        await page.evaluate((content) => {
            const html = document.querySelector('input[name="en[options][html]"]');
            const css = document.querySelector('input[name="en[options][css]"]');

            if (html instanceof HTMLInputElement) {
                html.value = content;
            }

            if (css instanceof HTMLInputElement) {
                css.value = content;
            }
        }, randomHtmlContent.toString());

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
    }
});

test('Create Image Slider Theme', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/settings/themes`);

        console.log('Create Image Slider Theme');

        await page.click('button[type="button"].primary-button:visible');

        page.click('select.custom-select:visible');

        const selects = await page.$$('select.custom-select:visible');

        for (let select of selects) {
            const options = await select.$$eval('option', (options) => {
                return options.map(option => option.value);
            });

            if (options.length > 0) {
                const randomIndex = Math.floor(Math.random() * options.length);

                await select.selectOption(options[randomIndex]);
            } else {
                await select.selectOption(options[0]);
            }
        }

        await page.selectOption('select[name="type"]', 'image_carousel');

        await page.fill('input[name="sort_order"]', (Math.floor(Math.random() * 1000000)).toString());

        await page.fill('input[name="name"]', forms.generateRandomStringWithSpaces(Math.floor(Math.random() * 100)));

        await page.click('button[type="submit"].primary-button:visible');

        await page.click('input[type="checkbox"] + label.peer:visible');

        const checkbox = await page.$('input[type="checkbox"] + label.peer:visible');

        let i = Math.floor(Math.random() * 10) + 1;

        if (i % 2 == 1) {
            await checkbox.click();
        }

        for (i; i > 0; i--) {
            await page.click('div[class="secondary-button"]:visible');

            const inputs = await page.$$('input[type="text"].rounded-md:visible');

            for (let input of inputs) {
                await input.fill(forms.generateRandomStringWithSpaces(200));
            }

            await page.$eval('label[class="mb-1.5 flex items-center gap-1 text-xs font-medium text-gray-800 dark:text-white required"]', (el, content) => {
                el.innerHTML += content;
            }, `<input type="file" name="slider_image[]" accept="image/*">`);

            const image = await page.$('input[type="file"][name="slider_image[]"]');

            const filePath = forms.getRandomImageFile();

            await image.setInputFiles(filePath);

            await inputs[0].press('Enter');
        }

        await page.fill('input[name="sort_order"]', (Math.floor(Math.random() * 1000000)).toString());

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
    }
});

test('Create Footer Link Theme', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/settings/themes`);

        console.log('Create Footer Link Theme');

        await page.click('button[type="button"].primary-button:visible');

        page.click('select.custom-select:visible');

        const selects = await page.$$('select.custom-select:visible');

        for (let select of selects) {
            const options = await select.$$eval('option', (options) => {
                return options.map(option => option.value);
            });

            if (options.length > 0) {
                const randomIndex = Math.floor(Math.random() * options.length);

                await select.selectOption(options[randomIndex]);
            } else {
                await select.selectOption(options[0]);
            }
        }

        await page.selectOption('select[name="type"]', 'footer_links');

        await page.fill('input[name="sort_order"]', (Math.floor(Math.random() * 1000000)).toString());

        await page.fill('input[name="name"]', forms.generateRandomStringWithSpaces(Math.floor(Math.random() * 100)));

        await page.click('button[type="submit"].primary-button:visible');

        await page.click('input[type="checkbox"] + label.peer:visible');

        const checkbox = await page.$('input[type="checkbox"] + label.peer:visible');

        let i = Math.floor(Math.random() * 10) + 1;

        if (i % 2 == 1) {
            await checkbox.click();
        }

        for (i; i > 0; i--) {
            await page.click('div[class="secondary-button"]:visible');

            const inputs = await page.$$('input[type="text"].rounded-md:visible');

            for (let input of inputs) {
                await input.fill(forms.generateRandomStringWithSpaces(200));
            }

            await page.fill('input[name="url"]', forms.generateRandomUrl());
            await page.fill('input[name="sort_order"][class="border !border-red-600 hover:border-red-600 w-full rounded-md border px-3 py-2.5 text-sm text-gray-600 transition-all hover:border-gray-400 focus:border-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-400 dark:focus:border-gray-400"]', (Math.floor(Math.random() * 1000000)).toString());

            const column = await page.$('select[name="column"]');

            if (column) {
                const options = await column.$$eval('option', (options) => {
                    return options.map(option => option.value);
                });

                if (options.length > 0) {
                    const randomIndex = Math.floor(Math.random() * options.length);

                    await column.selectOption(options[randomIndex]);
                }
            }
            await inputs[0].press('Enter');
        }

        await page.click('button[type="submit"].primary-button:visible');

        await page.fill('input[name="sort_order"]', (Math.floor(Math.random() * 1000000)).toString());

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
    }
});

test('Create Services Content Theme', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/settings/themes`);

        console.log('Create Services Content Theme');

        await page.click('button[type="button"].primary-button:visible');

        page.click('select.custom-select:visible');

        const selects = await page.$$('select.custom-select:visible');

        for (let select of selects) {
            const options = await select.$$eval('option', (options) => {
                return options.map(option => option.value);
            });

            if (options.length > 0) {
                const randomIndex = Math.floor(Math.random() * options.length);

                await select.selectOption(options[randomIndex]);
            } else {
                await select.selectOption(options[0]);
            }
        }

        await page.selectOption('select[name="type"]', 'services_content');

        await page.fill('input[name="sort_order"]', (Math.floor(Math.random() * 1000000)).toString());

        await page.fill('input[name="name"]', forms.generateRandomStringWithSpaces(Math.floor(Math.random() * 100)));

        await page.click('button[type="submit"].primary-button:visible');

        await page.click('input[type="checkbox"] + label.peer:visible');

        const checkbox = await page.$('input[type="checkbox"] + label.peer:visible');

        let i = Math.floor(Math.random() * 10) + 1;

        if (i % 2 == 1) {
            await checkbox.click();
        }

        for (i; i > 0; i--) {
            await page.click('div[class="secondary-button"]:visible');

            const inputs = await page.$$('input[type="text"].rounded-md:visible');

            for (let input of inputs) {
                await input.fill(forms.generateRandomStringWithSpaces(200));
            }

            await inputs[0].press('Enter');
        }

        await page.click('button[type="submit"].primary-button:visible');

        await page.fill('input[name="sort_order"]', (Math.floor(Math.random() * 1000000)).toString());

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
    }
});

test('Edit Product Carousel Theme', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/settings/themes`);

        console.log('Edit Product Carousel Theme');

        await page.waitForSelector('span[class="icon-filter text-2xl"]:visible');

        await page.click('span[class="icon-filter text-2xl"]:visible');

        const clearBtn = await page.$$('p[class="cursor-pointer text-xs font-medium leading-6 text-blue-600"]:visible');

        for (let i = 0; i < clearBtn.length; i++) {
            await clearBtn[i].click();
        }

        await page.fill('input[name="type"]:visible', 'product_carousel');
        await page.press('input[name="type"]:visible', 'Enter');

        const btnAdd = await page.$('button[type="button"][class="secondary-button w-full"]:visible');

        await btnAdd.scrollIntoViewIfNeeded();

        await page.click('button[type="button"][class="secondary-button w-full"]:visible');

        await page.waitForSelector('span[class="cursor-pointer rounded-md p-1.5 text-2xl transition-all hover:bg-gray-200 dark:hover:bg-gray-800 max-sm:place-self-center icon-edit"]', { timeout: 5000 }).catch(() => null);

        const iconEdit = await page.$$('span[class="cursor-pointer rounded-md p-1.5 text-2xl transition-all hover:bg-gray-200 dark:hover:bg-gray-800 max-sm:place-self-center icon-edit"]');

        if (iconEdit.length > 0) {
            await iconEdit[Math.floor(Math.random() * ((iconEdit.length - 1) - 0 + 1)) + 0].click();

            await page.click('input[type="checkbox"] + label.peer:visible');

            const deleteBtns = await page.$$('p.cursor-pointer.text-red-600.transition-all');

            for (let deleteBtn of deleteBtns) {
                let i = Math.floor(Math.random() * 10) + 1;

                if (i % 3 == 1) {
                    await deleteBtn.click();

                    await page.click('button[type="button"].transparent-button + button[type="button"].primary-button')

                    break;
                }
            }

            const checkbox = await page.$('input[type="checkbox"] + label.peer:visible');

            let i = Math.floor(Math.random() * 10) + 1;

            if (i % 2 == 1) {
                await checkbox.click();
            }

            const inputs = await page.$$('input[type="text"].rounded-md:visible');

            for (let input of inputs) {
                await input.fill(forms.generateRandomStringWithSpaces(200));
            }

            await page.fill('input[name="sort_order"]', (Math.floor(Math.random() * 1000000)).toString());

            const customSelects = await page.$$('select.custom-select:visible');

            for (let select of customSelects) {
                const options = await select.$$eval('option', (options) => {
                    return options.map(option => option.value);
                });

                if (options.length > 1) {
                    const randomIndex = Math.floor(Math.random() * (options.length - 1) + 1);

                    await select.selectOption(options[randomIndex]);
                } else {
                    await select.selectOption(options[0]);
                }
            }

            await page.click('div[class="secondary-button"]:visible');

            const key = await page.$('select[name="key"]');

            if (key) {
                const options = await key.$$eval('option', (options) => {
                    return options.map(option => option.value);
                });

                if (options.length > 0) {
                    const randomIndex = Math.floor(Math.random() * options.length);

                    await key.selectOption(options[randomIndex]);
                }
            }

            const value = await page.$('select[name="value"]');

            if (value) {
                const options = await value.$$eval('option', (options) => {
                    return options.map(option => option.value);
                });

                if (options.length > 0) {
                    const randomIndex = Math.floor(Math.random() * options.length);

                    await value.selectOption(options[randomIndex]);
                }
            } else {
                await page.fill('input[name="value"]', forms.generateRandomStringWithSpaces(Math.floor(Math.random() * 100)));
            }

            const errors = await page.$$('input[type="text"][class="border !border-red-600 hover:border-red-600 w-full rounded-md border px-3 py-2.5 text-sm text-gray-600 transition-all hover:border-gray-400 focus:border-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-400 dark:focus:border-gray-400"]:visible');

            for (let error of errors) {
                await error.fill((Math.random() * 10).toString());
            }

            const newErrors = await page.$$('input[class="border !border-red-600 hover:border-red-600 w-full rounded-md border px-3 py-2.5 text-sm text-gray-600 transition-all hover:border-gray-400 focus:border-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-400 dark:focus:border-gray-400"]:visible');

            for (let error of newErrors) {
                await error.fill((Math.floor(Math.random() * 10) + 1).toString());
            }

            await page.click('button[type="submit"][class="cursor-pointer rounded-md border border-blue-700 bg-blue-600 px-3 py-1.5 font-semibold text-gray-50"]:visible');

            const Errors = await page.waitForSelector('.text-red-600.text-xs.italic', { timeout: 3000 }).catch(() => null);

            if (Errors) {
                throw new Error('Selected key have no any option');
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
            console.log('No Theme found, create first.');
        }
    } catch (error) {
        console.log('Error during test execution:', error.message);
    }
});

test('Edit Category Carousel Theme', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/settings/themes`);

        console.log('Edit Category Carousel Theme');

        await page.waitForSelector('span[class="icon-filter text-2xl"]:visible');

        await page.click('span[class="icon-filter text-2xl"]:visible');

        const clearBtn = await page.$$('p[class="cursor-pointer text-xs font-medium leading-6 text-blue-600"]:visible');

        for (let i = 0; i < clearBtn.length; i++) {
            await clearBtn[i].click();
        }

        await page.fill('input[name="type"]:visible', 'category_carousel');
        await page.press('input[name="type"]:visible', 'Enter');

        const btnAdd = await page.$('button[type="button"][class="secondary-button w-full"]:visible');

        await btnAdd.scrollIntoViewIfNeeded();

        await page.click('button[type="button"][class="secondary-button w-full"]:visible');

        await page.waitForSelector('span[class="cursor-pointer rounded-md p-1.5 text-2xl transition-all hover:bg-gray-200 dark:hover:bg-gray-800 max-sm:place-self-center icon-edit"]', { timeout: 5000 }).catch(() => null);

        const iconEdit = await page.$$('span[class="cursor-pointer rounded-md p-1.5 text-2xl transition-all hover:bg-gray-200 dark:hover:bg-gray-800 max-sm:place-self-center icon-edit"]');

        if (iconEdit.length > 0) {
            await iconEdit[Math.floor(Math.random() * ((iconEdit.length - 1) - 0 + 1)) + 0].click();

            await page.click('input[type="checkbox"] + label.peer:visible');

            const deleteBtns = await page.$$('p.cursor-pointer.text-red-600.transition-all');

            for (let deleteBtn of deleteBtns) {
                let i = Math.floor(Math.random() * 10) + 1;

                if (i % 3 == 1) {
                    await deleteBtn.click();

                    await page.click('button[type="button"].transparent-button + button[type="button"].primary-button')

                    break;
                }
            }

            const checkbox = await page.$('input[type="checkbox"] + label.peer:visible');

            let i = Math.floor(Math.random() * 10) + 1;

            if (i % 2 == 1) {
                await checkbox.click();
            }

            const inputs = await page.$$('input[type="text"].rounded-md:visible');

            for (let input of inputs) {
                await input.fill(forms.generateRandomStringWithSpaces(200));
            }

            await page.fill('input[name="sort_order"]', (Math.floor(Math.random() * 1000000)).toString());
            await page.fill('input[name="en[options][filters][limit]"]', (Math.floor(Math.random() * 1000000)).toString());

            const customSelects = await page.$$('select.custom-select:visible');

            for (let select of customSelects) {
                const options = await select.$$eval('option', (options) => {
                    return options.map(option => option.value);
                });

                if (options.length > 1) {
                    const randomIndex = Math.floor(Math.random() * (options.length - 1) + 1);

                    await select.selectOption(options[randomIndex]);
                } else {
                    await select.selectOption(options[0]);
                }
            }

            await page.click('div[class="secondary-button"]:visible');

            const key = await page.$('select[name="key"]');

            if (key) {
                const options = await key.$$eval('option', (options) => {
                    return options.map(option => option.value);
                });

                if (options.length > 0) {
                    const randomIndex = Math.floor(Math.random() * options.length);

                    await key.selectOption(options[randomIndex]);
                }
            }

            const value = await page.$('select[name="value"]');

            if (value) {
                const options = await value.$$eval('option', (options) => {
                    return options.map(option => option.value);
                });

                if (options.length > 0) {
                    const randomIndex = Math.floor(Math.random() * options.length);

                    await value.selectOption(options[randomIndex]);
                }
            } else {
                await page.fill('input[name="value"]', forms.generateRandomStringWithSpaces(Math.floor(Math.random() * 100)));
            }

            const errors = await page.$$('input[type="text"][class="border !border-red-600 hover:border-red-600 w-full rounded-md border px-3 py-2.5 text-sm text-gray-600 transition-all hover:border-gray-400 focus:border-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-400 dark:focus:border-gray-400"]:visible');

            for (let error of errors) {
                await error.fill((Math.random() * 10).toString());
            }

            const newErrors = await page.$$('input[class="border !border-red-600 hover:border-red-600 w-full rounded-md border px-3 py-2.5 text-sm text-gray-600 transition-all hover:border-gray-400 focus:border-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-400 dark:focus:border-gray-400"]:visible');

            for (let error of newErrors) {
                await error.fill((Math.floor(Math.random() * 10) + 1).toString());
            }

            await page.click('button[type="submit"][class="cursor-pointer rounded-md border border-blue-700 bg-blue-600 px-3 py-1.5 font-semibold text-gray-50"]:visible');

            const Errors = await page.waitForSelector('.text-red-600.text-xs.italic', { timeout: 3000 }).catch(() => null);

            if (Errors) {
                throw new Error('Selected key have no any option');
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
            console.log('No Theme found, create first.');
        }
    } catch (error) {
        console.log('Error during test execution:', error.message);
    }
});

test('Edit Static Content Theme', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/settings/themes`);

        console.log('Edit Static Content Theme');

        await page.waitForSelector('span[class="icon-filter text-2xl"]:visible');

        await page.click('span[class="icon-filter text-2xl"]:visible');

        const clearBtn = await page.$$('p[class="cursor-pointer text-xs font-medium leading-6 text-blue-600"]:visible');

        for (let i = 0; i < clearBtn.length; i++) {
            await clearBtn[i].click();
        }

        await page.fill('input[name="type"]:visible', 'static_content');
        await page.press('input[name="type"]:visible', 'Enter');

        const btnAdd = await page.$('button[type="button"][class="secondary-button w-full"]:visible');

        await btnAdd.scrollIntoViewIfNeeded();

        await page.click('button[type="button"][class="secondary-button w-full"]:visible');

        await page.waitForSelector('span[class="cursor-pointer rounded-md p-1.5 text-2xl transition-all hover:bg-gray-200 dark:hover:bg-gray-800 max-sm:place-self-center icon-edit"]', { timeout: 5000 }).catch(() => null);

        const iconEdit = await page.$$('span[class="cursor-pointer rounded-md p-1.5 text-2xl transition-all hover:bg-gray-200 dark:hover:bg-gray-800 max-sm:place-self-center icon-edit"]');

        if (iconEdit.length > 0) {
            await iconEdit[Math.floor(Math.random() * ((iconEdit.length - 1) - 0 + 1)) + 0].click();

            await page.click('input[type="checkbox"] + label.peer:visible');

            const deleteBtns = await page.$$('p.cursor-pointer.text-red-600.transition-all');

            for (let deleteBtn of deleteBtns) {
                let i = Math.floor(Math.random() * 10) + 1;

                if (i % 3 == 1) {
                    await deleteBtn.click();

                    await page.click('button[type="button"].transparent-button + button[type="button"].primary-button')

                    break;
                }
            }

            const checkbox = await page.$('input[type="checkbox"] + label.peer:visible');

            let i = Math.floor(Math.random() * 10) + 1;

            if (i % 2 == 1) {
                await checkbox.click();
            }

            const randomHtmlContent = await forms.generateRandomStringWithSpaces(Math.floor(Math.random() * 1000));

            await page.evaluate((content) => {
                const html = document.querySelector('input[name="en[options][html]"]');
                const css = document.querySelector('input[name="en[options][css]"]');

                if (html instanceof HTMLInputElement) {
                    html.value = content;
                }

                if (css instanceof HTMLInputElement) {
                    css.value = content;
                }
            }, randomHtmlContent.toString());

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
        } else {
            console.log('No Theme found, create first.');
        }
    } catch (error) {
        console.log('Error during test execution:', error.message);
    }
});

test('Edit Image Slider Theme', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/settings/themes`);

        console.log('Edit Image Slider Theme');

        await page.waitForSelector('span[class="icon-filter text-2xl"]:visible');

        await page.click('span[class="icon-filter text-2xl"]:visible');

        const clearBtn = await page.$$('p[class="cursor-pointer text-xs font-medium leading-6 text-blue-600"]:visible');

        for (let i = 0; i < clearBtn.length; i++) {
            await clearBtn[i].click();
        }

        await page.fill('input[name="type"]:visible', 'image_carousel');
        await page.press('input[name="type"]:visible', 'Enter');

        const btnAdd = await page.$('button[type="button"][class="secondary-button w-full"]:visible');

        await btnAdd.scrollIntoViewIfNeeded();

        await page.click('button[type="button"][class="secondary-button w-full"]:visible');

        await page.waitForSelector('span[class="cursor-pointer rounded-md p-1.5 text-2xl transition-all hover:bg-gray-200 dark:hover:bg-gray-800 max-sm:place-self-center icon-edit"]', { timeout: 5000 }).catch(() => null);

        const iconEdit = await page.$$('span[class="cursor-pointer rounded-md p-1.5 text-2xl transition-all hover:bg-gray-200 dark:hover:bg-gray-800 max-sm:place-self-center icon-edit"]');

        if (iconEdit.length > 0) {
            await iconEdit[Math.floor(Math.random() * ((iconEdit.length - 1) - 0 + 1)) + 0].click();

            await page.click('input[type="checkbox"] + label.peer:visible');

            const deleteBtns = await page.$$('p.cursor-pointer.text-red-600.transition-all');

            for (let deleteBtn of deleteBtns) {
                let i = Math.floor(Math.random() * 10) + 1;

                if (i % 3 == 1) {
                    await deleteBtn.click();

                    await page.click('button[type="button"].transparent-button + button[type="button"].primary-button')

                    break;
                }
            }

            const checkbox = await page.$('input[type="checkbox"] + label.peer:visible');

            let i = Math.floor(Math.random() * 10) + 1;

            if (i % 2 == 1) {
                await checkbox.click();
            }

            for (i; i > 0; i--) {
                await page.click('div[class="secondary-button"]:visible');

                const inputs = await page.$$('input[type="text"].rounded-md:visible');

                for (let input of inputs) {
                    await input.fill(forms.generateRandomStringWithSpaces(200));
                }

                await page.$eval('label[class="mb-1.5 flex items-center gap-1 text-xs font-medium text-gray-800 dark:text-white required"]', (el, content) => {
                    el.innerHTML += content;
                }, `<input type="file" name="slider_image[]" accept="image/*">`);

                const image = await page.$('input[type="file"][name="slider_image[]"]');

                const filePath = forms.getRandomImageFile();

                await image.setInputFiles(filePath);

                await inputs[0].press('Enter');
            }

            await page.fill('input[name="sort_order"]', (Math.floor(Math.random() * 1000000)).toString());

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
        } else {
            console.log('No Theme found, create first.');
        }
    } catch (error) {
        console.log('Error during test execution:', error.message);
    }
});

test('Edit Footer Link Theme', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/settings/themes`);

        console.log('Edit Footer Link Theme');

        await page.waitForSelector('span[class="icon-filter text-2xl"]:visible');

        await page.click('span[class="icon-filter text-2xl"]:visible');

        const clearBtn = await page.$$('p[class="cursor-pointer text-xs font-medium leading-6 text-blue-600"]:visible');

        for (let i = 0; i < clearBtn.length; i++) {
            await clearBtn[i].click();
        }

        await page.fill('input[name="type"]:visible', 'footer_links');
        await page.press('input[name="type"]:visible', 'Enter');

        const btnAdd = await page.$('button[type="button"][class="secondary-button w-full"]:visible');

        await btnAdd.scrollIntoViewIfNeeded();

        await page.click('button[type="button"][class="secondary-button w-full"]:visible');

        await page.waitForSelector('span[class="cursor-pointer rounded-md p-1.5 text-2xl transition-all hover:bg-gray-200 dark:hover:bg-gray-800 max-sm:place-self-center icon-edit"]', { timeout: 5000 }).catch(() => null);

        const iconEdit = await page.$$('span[class="cursor-pointer rounded-md p-1.5 text-2xl transition-all hover:bg-gray-200 dark:hover:bg-gray-800 max-sm:place-self-center icon-edit"]');

        if (iconEdit.length > 0) {
            await iconEdit[Math.floor(Math.random() * ((iconEdit.length - 1) - 0 + 1)) + 0].click();

            await page.click('input[type="checkbox"] + label.peer:visible');

            const deleteBtns = await page.$$('p.cursor-pointer.text-red-600.transition-all');

            for (let deleteBtn of deleteBtns) {
                let i = Math.floor(Math.random() * 10) + 1;

                if (i % 3 == 1) {
                    await deleteBtn.click();

                    await page.click('button[type="button"].transparent-button + button[type="button"].primary-button')

                    break;
                }
            }

            const checkbox = await page.$('input[type="checkbox"] + label.peer:visible');

            let i = Math.floor(Math.random() * 10) + 1;

            if (i % 2 == 1) {
                await checkbox.click();
            }

            for (i; i > 0; i--) {
                await page.click('div[class="secondary-button"]:visible');

                const inputs = await page.$$('input[type="text"].rounded-md:visible');

                for (let input of inputs) {
                    await input.fill(forms.generateRandomStringWithSpaces(200));
                }

                await page.fill('input[name="url"]', forms.generateRandomUrl());
                await page.fill('input[name="sort_order"][class="border !border-red-600 hover:border-red-600 w-full rounded-md border px-3 py-2.5 text-sm text-gray-600 transition-all hover:border-gray-400 focus:border-gray-400 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-400 dark:focus:border-gray-400"]', (Math.floor(Math.random() * 1000000)).toString());

                const column = await page.$('select[name="column"]');

                if (column) {
                    const options = await column.$$eval('option', (options) => {
                        return options.map(option => option.value);
                    });

                    if (options.length > 0) {
                        const randomIndex = Math.floor(Math.random() * options.length);

                        await column.selectOption(options[randomIndex]);
                    }
                }
                await inputs[0].press('Enter');
            }

            await page.click('button[type="submit"].primary-button:visible');

            await page.fill('input[name="sort_order"]', (Math.floor(Math.random() * 1000000)).toString());

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
        } else {
            console.log('No Theme found, create first.');
        }
    } catch (error) {
        console.log('Error during test execution:', error.message);
    }
});

test('Edit Services Content Theme', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/settings/themes`);

        console.log('Edit Services Content Theme');

        await page.waitForSelector('span[class="icon-filter text-2xl"]:visible');

        await page.click('span[class="icon-filter text-2xl"]:visible');

        const clearBtn = await page.$$('p[class="cursor-pointer text-xs font-medium leading-6 text-blue-600"]:visible');

        for (let i = 0; i < clearBtn.length; i++) {
            await clearBtn[i].click();
        }

        await page.fill('input[name="type"]:visible', 'services_content');
        await page.press('input[name="type"]:visible', 'Enter');

        const btnAdd = await page.$('button[type="button"][class="secondary-button w-full"]:visible');

        await btnAdd.scrollIntoViewIfNeeded();

        await page.click('button[type="button"][class="secondary-button w-full"]:visible');

        await page.waitForSelector('span[class="cursor-pointer rounded-md p-1.5 text-2xl transition-all hover:bg-gray-200 dark:hover:bg-gray-800 max-sm:place-self-center icon-edit"]', { timeout: 5000 }).catch(() => null);

        const iconEdit = await page.$$('span[class="cursor-pointer rounded-md p-1.5 text-2xl transition-all hover:bg-gray-200 dark:hover:bg-gray-800 max-sm:place-self-center icon-edit"]');

        if (iconEdit.length > 0) {
            await iconEdit[Math.floor(Math.random() * ((iconEdit.length - 1) - 0 + 1)) + 0].click();

            await page.click('input[type="checkbox"] + label.peer:visible');

            const deleteBtns = await page.$$('p.cursor-pointer.text-red-600.transition-all');

            for (let deleteBtn of deleteBtns) {
                let i = Math.floor(Math.random() * 10) + 1;

                if (i % 3 == 1) {
                    await deleteBtn.click();

                    await page.click('button[type="button"].transparent-button + button[type="button"].primary-button')

                    break;
                }
            }

            const checkbox = await page.$('input[type="checkbox"] + label.peer:visible');

            let i = Math.floor(Math.random() * 10) + 1;

            if (i % 2 == 1) {
                await checkbox.click();
            }

            for (i; i > 0; i--) {
                await page.click('div[class="secondary-button"]:visible');

                const inputs = await page.$$('input[type="text"].rounded-md:visible');

                for (let input of inputs) {
                    await input.fill(forms.generateRandomStringWithSpaces(200));
                }

                await inputs[0].press('Enter');
            }

            await page.click('button[type="submit"].primary-button:visible');

            await page.fill('input[name="sort_order"]', (Math.floor(Math.random() * 1000000)).toString());

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
        } else {
            console.log('No Theme found, create first.');
        }
    } catch (error) {
        console.log('Error during test execution:', error.message);
    }
});

test('Delete Theme', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/settings/themes`);

        console.log('Delete Theme');

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
            console.log('No Theme found, create first.');
        }
    } catch (error) {
        console.log('Error during test execution:', error.message);
    }
});
