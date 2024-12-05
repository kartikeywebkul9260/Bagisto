import { test } from '@playwright/test';
import config from '../../Config/config';
import { generateRandomProductName } from '../../Helpers/admin/formHelper'
import * as forms from '../../Helpers/shop/formHelper';

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
            dir: 'videos/shop/compare/',
            size: { width: 1280, height: 720 }
        }
    });

    // Open a new page
    page = await context.newPage();
});

test('Search by query', async () => {
    try {
        await page.goto(`${baseUrl}`);

        console.log('Search by query');

        const query = generateRandomProductName();

        await page.fill('input[name="query"]', query);

        await page.press('input[name="query"]', 'Enter');

        const exists = await page.waitForSelector('img.relative.bg-zinc-100.transition-all.duration-300', { timeout: 10000 }).catch(() => null);

        if (exists) {
            const buttons = await page.$$('img.relative.bg-zinc-100.transition-all.duration-300');
            console.log(`${buttons.length} Products found`);
        } else {
            console.log(`No Product found`);
        }
    } catch (error) {
        console.error('Error during test execution:', error.message);
    }
});

test('Search by image', async () => {
    test.setTimeout(config.mediumTimeout);

    try {
        await page.goto(`${baseUrl}`);

        console.log('Search by image');

        const filePath = forms.getRandomImageFile();
        await page.setInputFiles('input[type="file"]#v-image-search-19', filePath);

        const exists = await page.waitForSelector('img.relative.bg-zinc-100.transition-all.duration-300', { timeout: 20000 }).catch(() => null);

        if (exists) {
            const buttons = await page.$$('img.relative.bg-zinc-100.transition-all.duration-300');
            console.log(`${buttons.length} Products found`);
        } else {
            const keys = await page.$$('.flex.cursor-pointer.items-center.justify-center.rounded-full.border.border-navyBlue.px-4.font-medium.text-navyBlue');

            if (keys.length > 0) {
                await keys[Math.floor(Math.random() * ((keys.length - 1) - 1 + 1)) + 1].click();
                const exists = await page.waitForSelector('img.relative.bg-zinc-100.transition-all.duration-300', { timeout: 10000 }).catch(() => null);

                if (exists) {
                    const buttons = await page.$$('img.relative.bg-zinc-100.transition-all.duration-300');
                    console.log(`${buttons.length} Products found`);
                } else {
                    console.log(`No Product found`);
                }
            } else {
                console.log(`No Product found`);
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
    console.info('Browser session closed.');
});
