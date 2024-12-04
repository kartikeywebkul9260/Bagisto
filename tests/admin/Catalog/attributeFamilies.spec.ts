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
            dir: 'videos/Catalog/attributeFamilies',
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

test('Create Attribute Family', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/catalog/families`);

        console.log('Create Attribute Family');

        await page.click('div.primary-button:visible');

        await page.click('div.secondary-button:visible');

        await page.fill('div[class="box-shadow absolute top-1/2 z-[999] w-full max-w-[568px] -translate-y-1/2 rounded-lg bg-white dark:bg-gray-900 max-md:w-[90%] ltr:left-1/2 ltr:-translate-x-1/2 rtl:right-1/2 rtl:translate-x-1/2"] input[name="code"]', forms.generateRandomStringWithSpaces(Math.floor(Math.random() * 10)));
        await page.fill('div[class="box-shadow absolute top-1/2 z-[999] w-full max-w-[568px] -translate-y-1/2 rounded-lg bg-white dark:bg-gray-900 max-md:w-[90%] ltr:left-1/2 ltr:-translate-x-1/2 rtl:right-1/2 rtl:translate-x-1/2"] input[name="name"]', forms.generateRandomStringWithSpaces(Math.floor(Math.random() * 100)));

        const select = await page.$('select[name="column"].custom-select');

        const options = await select.$$eval('option', (options) => {
            return options.map(option => option.value);
        });

        if (options.length > 0) {
            const randomIndex = Math.floor(Math.random() * 2) + 1;

            await select.selectOption(options[randomIndex]);
        }

        await page.press('div[class="box-shadow absolute top-1/2 z-[999] w-full max-w-[568px] -translate-y-1/2 rounded-lg bg-white dark:bg-gray-900 max-md:w-[90%] ltr:left-1/2 ltr:-translate-x-1/2 rtl:right-1/2 rtl:translate-x-1/2"] input[name="code"]', 'Enter');

        await page.waitForSelector('div#not_avaliable', { timeout: 1000 }).catch(() => null);

        const concatenatedNames = Array(5)
            .fill(null)
            .map(() => forms.generateRandomProductName())
            .join(' ')
            .replaceAll(' ', '');

        await page.fill('input[name="name"]', forms.generateRandomStringWithSpaces(Math.floor(Math.random() * 200)));
        await page.fill('input[name="code"]', concatenatedNames);

        const attributes = await page.$$('i.icon-drag');
        const targets = await page.$$('div[class="flex [&>*]:flex-1 gap-5 justify-between px-4"] > div > div[class="h-[calc(100vh-285px)] overflow-auto border-gray-200 pb-4 ltr:border-r rtl:border-l"]');

        if (
            attributes.length > 0
            && targets.length === 2
        ) {
            for (const attribute of attributes) {

                const randomTargetIndex = Math.floor(Math.random() * targets.length);
                const target = targets[randomTargetIndex];

                const attributeBox = await attribute.boundingBox();
                const targetBox = await target.boundingBox();

                if (
                    attributeBox
                    && targetBox
                ) {
                    const randomX = targetBox.x + Math.random() * targetBox.width;
                    const randomY = targetBox.y + Math.random() * targetBox.height;

                    await page.mouse.move(attributeBox.x + attributeBox.width / 2, attributeBox.y + attributeBox.height / 2);
                    await page.mouse.down();
                    await page.mouse.move(randomX, randomY);
                    await page.mouse.up();

                    console.log(`Dragged an attribute to a random position (${randomX.toFixed(2)}, ${randomY.toFixed(2)}) in target ${randomTargetIndex + 1}.`);
                } else {
                    console.log('Could not retrieve bounding box for attribute or target container.');
                }
            }
        } else if (attributes.length === 0) {
            console.error('No draggable attributes found.');
        } else {
            console.error('Expected  2 target containers, but found:', targets.length);
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
            const iconExists = await page.waitForSelector('.flex.items-center.break-all.text-sm > .icon-toast-done.rounded-full.bg-white.text-2xl', { timeout: 5000 }).catch(() => null);

            if (iconExists) {
                const messages = await page.$$('.flex.items-center.break-all.text-sm > .icon-toast-done.rounded-full.bg-white.text-2xl');
                const icons = await page.$$('.flex.items-center.break-all.text-sm + .cursor-pointer.underline');

                message = await messages[0].evaluate(el => el.parentNode.innerText);
                await icons[0].click();
                console.info(message);
            } else {
                console.log('The cobination you are tring is no able to create');
            }
        }
    } catch (error) {
        console.error('Error during test execution:', error.message);
    }
});

test('Edit Attribute Family', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/catalog/families`);

        console.log('Edit Attribute Family');

        await page.waitForSelector('div#not_available', { timeout: 5000 }).catch(() => null);
        const iconEdit = await page.$$('span[class="cursor-pointer rounded-md p-1.5 text-2xl transition-all hover:bg-gray-200 dark:hover:bg-gray-800 max-sm:place-self-center icon-edit"]');

        if (iconEdit.length > 0) {
            await iconEdit[Math.floor(Math.random() * ((iconEdit.length - 1) - 0 + 1)) + 0].click();

            await page.click('div.secondary-button:visible');

            await page.fill('div[class="box-shadow absolute top-1/2 z-[999] w-full max-w-[568px] -translate-y-1/2 rounded-lg bg-white dark:bg-gray-900 max-md:w-[90%] ltr:left-1/2 ltr:-translate-x-1/2 rtl:right-1/2 rtl:translate-x-1/2"] input[name="code"]', forms.generateRandomStringWithSpaces(Math.floor(Math.random() * 10)));
            await page.fill('div[class="box-shadow absolute top-1/2 z-[999] w-full max-w-[568px] -translate-y-1/2 rounded-lg bg-white dark:bg-gray-900 max-md:w-[90%] ltr:left-1/2 ltr:-translate-x-1/2 rtl:right-1/2 rtl:translate-x-1/2"] input[name="name"]', forms.generateRandomStringWithSpaces(Math.floor(Math.random() * 100)));

            const select = await page.$('select[name="column"].custom-select');

            const options = await select.$$eval('option', (options) => {
                return options.map(option => option.value);
            });

            if (options.length > 0) {
                const randomIndex = Math.floor(Math.random() * 2) + 1;

                await select.selectOption(options[randomIndex]);
            }

            await page.press('div[class="box-shadow absolute top-1/2 z-[999] w-full max-w-[568px] -translate-y-1/2 rounded-lg bg-white dark:bg-gray-900 max-md:w-[90%] ltr:left-1/2 ltr:-translate-x-1/2 rtl:right-1/2 rtl:translate-x-1/2"] input[name="code"]', 'Enter');

            await page.waitForSelector('div#not_avaliable', { timeout: 1000 }).catch(() => null);

            await page.fill('input[name="name"]', forms.generateRandomStringWithSpaces(Math.floor(Math.random() * 100)));

            const attributes = await page.$$('i.icon-drag');
            const targets = await page.$$('div[class="flex [&>*]:flex-1 gap-5 justify-between px-4"] > div > div[class="h-[calc(100vh-285px)] overflow-auto border-gray-200 pb-4 ltr:border-r rtl:border-l"]');

            if (
                attributes.length > 0
                && targets.length === 2
            ) {
                for (const attribute of attributes) {

                    const randomTargetIndex = Math.floor(Math.random() * targets.length);
                    const target = targets[randomTargetIndex];

                    const attributeBox = await attribute.boundingBox();
                    const targetBox = await target.boundingBox();

                    if (
                        attributeBox
                        && targetBox
                    ) {
                        const randomX = targetBox.x + Math.random() * targetBox.width;
                        const randomY = targetBox.y + Math.random() * targetBox.height;

                        await page.mouse.move(attributeBox.x + attributeBox.width / 2, attributeBox.y + attributeBox.height / 2);
                        await page.mouse.down();
                        await page.mouse.move(randomX, randomY);
                        await page.mouse.up();

                        console.log(`Dragged an attribute to a random position (${randomX.toFixed(2)}, ${randomY.toFixed(2)}) in target ${randomTargetIndex + 1}.`);
                    } else {
                        console.log('Could not retrieve bounding box for attribute or target container.');
                    }
                }
            } else if (attributes.length === 0) {
                console.error('No draggable attributes found.');
            } else {
                console.error('Expected  2 target containers, but found:', targets.length);
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
                const iconExists = await page.waitForSelector('.flex.items-center.break-all.text-sm > .icon-toast-done.rounded-full.bg-white.text-2xl', { timeout: 5000 }).catch(() => null);

                if (iconExists) {
                    const messages = await page.$$('.flex.items-center.break-all.text-sm > .icon-toast-done.rounded-full.bg-white.text-2xl');
                    const icons = await page.$$('.flex.items-center.break-all.text-sm + .cursor-pointer.underline');

                    message = await messages[0].evaluate(el => el.parentNode.innerText);
                    await icons[0].click();
                    console.info(message);
                } else {
                    console.log('The cobination you are tring is no able to update');
                }
            }
        } else {
            console.error('No Attribute family found, create first.');
        }
    } catch (error) {
        console.error('Error during test execution:', error.message);
    }
});

test('Delete Attribute Family', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}/admin/catalog/families`);

        console.log('Delete Attribute Family');

        await page.waitForSelector('div#not_available', { timeout: 5000 }).catch(() => null);
        const iconDelete = await page.$$('span[class="cursor-pointer rounded-md p-1.5 text-2xl transition-all hover:bg-gray-200 dark:hover:bg-gray-800 max-sm:place-self-center icon-delete"]');

        if (iconDelete.length > 0) {
            await iconDelete[Math.floor(Math.random() * ((iconDelete.length - 1) - 0 + 1)) + 0].click();

            await page.hover('button.transparent-button + button.primary-button:visible');

            const iconExists = await page.waitForSelector('.flex.items-center.break-all.text-sm > .icon-toast-done.rounded-full.bg-white.text-2xl', { timeout: 5000 }).catch(() => null);

            if (iconExists) {
                const messages = await page.$$('.flex.items-center.break-all.text-sm > .icon-toast-done.rounded-full.bg-white.text-2xl');
                const icons = await page.$$('.flex.items-center.break-all.text-sm + .cursor-pointer.underline');

                const message = await messages[0].evaluate(el => el.parentNode.innerText);
                await icons[0].click();
                console.info(message);
            }
        } else {
            console.error('No Attribute family found, create first.');
        }
    } catch (error) {
        console.error('Error during test execution:', error.message);
    }
});
