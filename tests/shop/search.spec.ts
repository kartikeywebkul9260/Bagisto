import { test } from '@playwright/test';
import config from '../../Config/config';
import { generateRandomProductName } from '../../Helpers/admin/formHelper'
import * as forms from '../../Helpers/shop/formHelper';

const baseUrl = config.baseUrl;

test('Search by query', async () => {
    const { chromium, firefox, webkit } = require('playwright');

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
        await page.goto(`${baseUrl}`);

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
        console.log('Error during test execution:', error.message);
    } finally {
        await page.close();
        await context.close();
        await browser.close();
    }
});

test('Search by image', async () => {
    test.setTimeout(config.mediumTimeout);
    const { chromium, firefox, webkit } = require('playwright');

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
        await page.goto(`${baseUrl}`);

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
        console.log('Error during test execution:', error.message);
    } finally {
        await page.close();
        await context.close();
        await browser.close();
    }
});
