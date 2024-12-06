import { test } from '@playwright/test';
import config from '../../Config/config';
import logIn from '../../Helpers/shop/loginHelper';

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
    context = await browser.newContext();

    // Open a new page
    page = await context.newPage();
});

test('Category Page', async () => {

    try {
        await page.goto(`${baseUrl}`);

        console.log('Category Page');

        const addExists = await page.waitForSelector('.group.relative.flex.items-center.border-b-4.border-transparent', { timeout: 10000 }).catch(() => null);

        if (addExists) {
            var categoriesList1 = await page.$$('.group.relative.flex.items-center.border-b-4.border-transparent');
            var categoriesList2 = await page.$$('.group.relative.flex.items-center.border-b-4.border-transparent >.pointer-events-none.absolute.w-max.translate-y-1.overflow-auto.overflow-x-auto.border.border-b-0.border-l-0.border-r-0.border-t.bg-white.p-9.opacity-0.transition.duration-300.ease-out > .aigns.flex.justify-between > div > p > a');
            var categoriesList3 = await page.$$('.group.relative.flex.items-center.border-b-4.border-transparent >.pointer-events-none.absolute.w-max.translate-y-1.overflow-auto.overflow-x-auto.border.border-b-0.border-l-0.border-r-0.border-t.bg-white.p-9.opacity-0.transition.duration-300.ease-out > .aigns.flex.justify-between > div > ul > li > a');

            const categoriesList = [...categoriesList1, ...categoriesList2, ...categoriesList3];

            if (categoriesList.length > 0) {
                const selected = await categoriesList[Math.floor(Math.random() * ((categoriesList.length - 1) - 0 + 1)) + 0];

                if (await categoriesList1.includes(selected)) {
                    await selected.click();
                    await page.waitForSelector('.cursor-pointer.text-2xl.icon-listing + .cursor-pointer.text-2xl.icon-grid-view-fill', { timeout: 10000 }).catch(() => null);
                } else if (await categoriesList2.includes(selected)) {
                    const parent = await selected.evaluateHandle(el => el.parentNode.parentNode.parentNode.parentNode.parentNode);
                    await parent.hover();
                    await selected.click();
                    await page.waitForSelector('.cursor-pointer.text-2xl.icon-listing + .cursor-pointer.text-2xl.icon-grid-view-fill', { timeout: 10000 }).catch(() => null);
                    await parent.dispose();
                } else {
                    const parent = await selected.evaluateHandle(el => el.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode);
                    await parent.hover();
                    await selected.click();
                    await page.waitForSelector('.cursor-pointer.text-2xl.icon-listing + .cursor-pointer.text-2xl.icon-grid-view-fill', { timeout: 10000 }).catch(() => null);
                    await parent.dispose();
                }

                console.log(page.url());

            } else {
                console.log('No any category is avaliable');
            }
        }
    } catch (error) {
        console.error('Error during test execution:', error.message);
    }
});

test('Product Page', async () => {

    try {
        await page.goto(`${baseUrl}`);

        console.log('Product Page');

        const addExists = await page.waitForSelector('.container.mt-20 > .flex.justify-between + .flex.gap-8.mt-10.overflow-auto.scroll-smooth.scrollbar-hide > .group.w-full.rounded-md', { timeout: 10000 }).catch(() => null);

        if (addExists) {
            var productsList = await page.$$('img.relative.bg-zinc-100.transition-all.duration-300');

            if (productsList.length > 0) {
                const parent = await productsList[Math.floor(Math.random() * ((productsList.length - 1) - 0 + 1)) + 0].evaluateHandle(el => el.parentNode);

                await parent.click();

                await page.waitForSelector('img.transparent.cursor-pointer.rounded-xl.border.pointer-events-none.border.border-navyBlue', { timeout: 10000 }).catch(() => null);
                console.log(page.url());
            } else {
                console.log('No any Product is avaliable');
            }
        }
    } catch (error) {
        console.error('Error during test execution:', error.message);
    }
});

test('Review Product', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        const log = await logIn(page);

        if (log == null) {
            return;
        }

        await page.goto(`${baseUrl}`);

        console.log('Review Product');

        const addExists = await page.waitForSelector('.container.mt-20 > .flex.justify-between + .flex.gap-8.mt-10.overflow-auto.scroll-smooth.scrollbar-hide > .group.w-full.rounded-md', { timeout: 10000 }).catch(() => null);

        if (addExists) {
            var productsList = await page.$$('img.relative.bg-zinc-100.transition-all.duration-300');

            if (productsList.length > 0) {
                const parent = await productsList[Math.floor(Math.random() * ((productsList.length - 1) - 0 + 1)) + 0].evaluateHandle(el => el.parentNode);

                await parent.click();

                await page.waitForSelector('img.transparent.cursor-pointer.rounded-xl.border.pointer-events-none.border.border-navyBlue', { timeout: 10000 }).catch(() => null);
                console.log(page.url());
                const addExists = await page.waitForSelector('#review-tab-button', { timeout: 10000 }).catch(() => null);

                if (addExists) {
                    await page.click('#review-tab-button');

                    await page.click('.mt-8.flex.cursor-pointer.items-center.gap-x-4.rounded-xl.border.border-navyBlue.px-4 > .icon-pen.text-2xl:visible');

                    await page.$eval('input[type="hidden"][name="rating"]', el => el.value = Math.floor(Math.random() * 4) + 1);

                    await page.fill('input[name="title"]', 'good');

                    await page.fill('textarea[name="comment"]', 'good');

                    await page.press('input[name="title"]', 'Enter');
                } else {
                    const addExists = await page.waitForSelector('#review-accordian-button', { timeout: 10000 }).catch(() => null);

                    if (addExists) {
                        await page.click('#review-accordian-button');
                        const addExists = await page.waitForSelector('.mt-8.flex.cursor-pointer.items-center.gap-x-4.rounded-xl.border.border-navyBlue.px-4 > .icon-pen.text-2xl:visible', { timeout: 500 }).catch(() => null);

                        if (addExists) {
                            await page.click('.mt-8.flex.cursor-pointer.items-center.gap-x-4.rounded-xl.border.border-navyBlue.px-4 > .icon-pen.text-2xl:visible');

                            await page.$$('.icon-star-fill.cursor-pointer.text-2xl.text-amber-500')[Math.floor(Math.random() * (5))].click();

                            await page.fill('input[name="title"]', 'good');

                            await page.fill('textarea[name="comment"]', 'good');

                            await page.press('input[name="title"]', 'Enter');
                        } else {
                            console.log('Review is not avaliable for this product');
                        }
                    } else {
                        console.log('Review is not avaliable for this product');
                    }
                }
            } else {
                console.log('No any Product is avaliable');
            }
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
