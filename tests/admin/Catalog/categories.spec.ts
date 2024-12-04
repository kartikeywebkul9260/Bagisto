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
            dir: 'videos/admin/Catalog/categories/',
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

test('Create Category', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/catalog/categories`);

        console.log('Create Categories');

        await page.click('div.primary-button:visible');

        await page.waitForSelector('input[name="name"]#name');

        await page.fill('input[name="name"]#name', forms.generateRandomStringWithSpaces(Math.floor(Math.random() * 500)));

        await page.fill('input[name="position"]', (Math.floor(Math.random() * 100)).toString());

        const parents = await page.$$('input[name="parent_id"] + span[class="icon-radio-normal peer-checked:icon-radio-selected mr-1 cursor-pointer rounded-md text-2xl peer-checked:text-blue-600"]');

        await parents[Math.floor(Math.random() * ((parents.length - 1) - 0 + 1)) + 0].click();

        await page.waitForSelector('iframe');
        const iframe = await page.$('iframe');

        const frame = await iframe.contentFrame();

        const randomHtmlContent = await forms.fillParagraphWithRandomHtml(50);

        await frame.$eval('body[data-id="description"] > p', (el, content) => {
            el.innerHTML = content;
        }, randomHtmlContent);

        await page.$eval('p.mb-4.text-base.font-semibold.text-gray-800', (el, content) => {
            el.innerHTML += content;
        }, `<input type="file" name="logo_path[]" accept="image/*"><input type="file" name="banner_path[]" accept="image/*">`);

        const images = await page.$$('input[type="file"][name="logo_path[]"], input[type="file"][name="banner_path[]"]');

        const filePath = forms.getRandomImageFile();

        for (let image of images) {
            await image.setInputFiles(filePath);
        }

        await page.evaluate((content) => {
            const description = document.querySelector('textarea[name="description"]#description');

            if (description instanceof HTMLTextAreaElement) {
                description.style.display = content;
            }
        }, 'block');

        await page.fill('textarea[name="description"]', randomHtmlContent.toString());

        await page.evaluate((content) => {
            const description = document.querySelector('textarea[name="description"]#description');

            if (description instanceof HTMLTextAreaElement) {
                description.style.display = content;
            }
        }, 'none');

        const textareas = await page.$$('textarea:visible, input[name="meta_title"], input[name="meta_keywords"]');

        for (let textarea of textareas) {
            let i = Math.floor(Math.random() * 10) + 1;

            if (i % 3 == 1) {
                await textarea.fill(forms.generateRandomStringWithSpaces(200));
            }
        }

        const selects = await page.$$('select.custom-select');

        for (let select of selects) {
            const options = await select.$$eval('option', (options) => {
                return options.map(option => option.value);
            });

            if (options.length > 0) {
                const randomIndex = Math.floor(Math.random() * options.length);

                await select.selectOption(options[randomIndex]);
            }
        }

        const checkboxs = await page.$$('input[type="checkbox"] + label');

        for (let checkbox of checkboxs) {
            let i = Math.floor(Math.random() * 10) + 1;

            if (i % 2 == 1) {
                await checkbox.click();
            }
        }

        await page.click('.primary-button:visible');

        const getError = await page.waitForSelector('.text-red-600.text-xs.italic', { timeout: 3000 }).catch(() => null);
        var message = '';

        if (getError) {
            const errors = await page.$$('.text-red-600.text-xs.italic');

            for (let error of errors) {
                message = await error.evaluate(el => el.innerText);
                console.error(message);
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

test('Edit Category', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/catalog/categories`);

        console.log('Edit Categories');

        await page.waitForSelector('div#not_available', { timeout: 5000 }).catch(() => null);

        const iconEdit = await page.$$('span[class="cursor-pointer rounded-md p-1.5 text-2xl transition-all hover:bg-gray-200 dark:hover:bg-gray-800 max-sm:place-self-center icon-edit"]');

        if (iconEdit.length > 0) {
            await iconEdit[Math.floor(Math.random() * ((iconEdit.length - 1) - 0 + 1)) + 0].click();

            await page.waitForSelector('input[name="en[name]"]');

            await page.fill('input[name="en[name]"]', forms.generateRandomStringWithSpaces(Math.floor(Math.random() * 500)));

            await page.fill('input[name="position"]', (Math.floor(Math.random() * 100)).toString());

            const parents = await page.$$('input[name="parent_id"] + span[class="icon-radio-normal peer-checked:icon-radio-selected mr-1 cursor-pointer rounded-md text-2xl peer-checked:text-blue-600"]');

            await parents[Math.floor(Math.random() * ((parents.length - 1) - 0 + 1)) + 0].click();

            await page.waitForSelector('iframe');
            const iframe = await page.$('iframe');

            const frame = await iframe.contentFrame();

            const randomHtmlContent = await forms.fillParagraphWithRandomHtml(50);

            await frame.$eval('body[data-id="description"] > p', (el, content) => {
                el.innerHTML = content;
            }, randomHtmlContent);

            let number = Math.floor(Math.random() * 4) + 1;

            await page.$eval('p.mb-4.text-base.font-semibold.text-gray-800', (el, content) => {
                el.innerHTML += content;
            }, `<input type="file" name="logo_path[]" accept="image/*"><input type="file" name="banner_path[]" accept="image/*">`);

            const images = await page.$$('input[type="file"][name="logo_path[]"], input[type="file"][name="banner_path[]"]');

            const filePath = forms.getRandomImageFile();

            for (let image of images) {
                await image.setInputFiles(filePath);
            }

            await page.evaluate((content) => {
                const description = document.querySelector('textarea[name="en[description]"]#description');

                if (description instanceof HTMLTextAreaElement) {
                    description.style.display = content;
                }
            }, 'block');

            await page.fill('textarea[name="en[description]"]', randomHtmlContent.toString());

            await page.evaluate((content) => {
                const description = document.querySelector('textarea[name="en[description]"]#description');

                if (description instanceof HTMLTextAreaElement) {
                    description.style.display = content;
                }
            }, 'none');

            const textareas = await page.$$('textarea:visible, input[name="en[meta_title]"], input[name="en[meta_keywords]"]');

            for (let textarea of textareas) {
                let i = Math.floor(Math.random() * 10) + 1;

                if (i % 3 == 1) {
                    await textarea.fill(forms.generateRandomStringWithSpaces(200));
                }
            }

            const selects = await page.$$('select.custom-select');

            for (let select of selects) {
                const options = await select.$$eval('option', (options) => {
                    return options.map(option => option.value);
                });

                if (options.length > 0) {
                    const randomIndex = Math.floor(Math.random() * options.length);

                    await select.selectOption(options[randomIndex]);
                }
            }

            const checkboxs = await page.$$('input[type="checkbox"] + label');

            for (let checkbox of checkboxs) {
                let i = Math.floor(Math.random() * 10) + 1;

                if (i % 2 == 1) {
                    await checkbox.click();
                }
            }

            await page.click('.primary-button:visible');

            const getError = await page.waitForSelector('.text-red-600.text-xs.italic', { timeout: 3000 }).catch(() => null);
            var message = '';

            if (getError) {
                const errors = await page.$$('.text-red-600.text-xs.italic');

                for (let error of errors) {
                    message = await error.evaluate(el => el.innerText);
                    console.error(message);
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
        } else {
            console.error('No category found, create first.');
        }
    } catch (error) {
        console.error('Error during test execution:', error.message);
    }
});

test('Delete Category', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/catalog/categories`);

        console.log('Delete Categories');

        await page.waitForSelector('div#not_available', { timeout: 5000 }).catch(() => null);

        const iconEdit = await page.$$('span[class="cursor-pointer rounded-md p-1.5 text-2xl transition-all hover:bg-gray-200 dark:hover:bg-gray-800 max-sm:place-self-center icon-delete"]');

        if (iconEdit.length > 0) {
            await iconEdit[Math.floor(Math.random() * ((iconEdit.length - 1) - 0 + 1)) + 0].click();

            await page.click('button.transparent-button + button.primary-button:visible');

            const iconExists = await page.waitForSelector('.flex.items-center.break-all.text-sm > .icon-toast-done.rounded-full.bg-white.text-2xl');

            if (iconExists) {
                const messages = await page.$$('.flex.items-center.break-all.text-sm > .icon-toast-done.rounded-full.bg-white.text-2xl');
                const icons = await page.$$('.flex.items-center.break-all.text-sm + .cursor-pointer.underline');

                const message = await messages[0].evaluate(el => el.parentNode.innerText);
                await icons[0].click();
                console.info(message);
            }
        } else {
            console.error('No category found, create first.');
        }
    } catch (error) {
        console.error('Error during test execution:', error.message);
    }
});

test('Mass Delete Categories', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/catalog/categories`);

        console.log('Mass Delete Categories');

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
                    console.info(message);
                }
            } else {
                console.log('Please select any category.');
            }
        } else {
            console.error('No category found, create first.');
        }
    } catch (error) {
        console.error('Error during test execution:', error.message);
    }
});

test('Mass Update Categories', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/catalog/categories`);

        console.log('Mass Update Categories');

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
                    console.info(message);
                }
            } else {
                console.log('Please select any category.');
            }
        } else {
            console.error('No category found, create first.');
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
