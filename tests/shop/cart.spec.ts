import { test } from '@playwright/test';
import config from '../../Config/config';
import addToCart from '../../Helpers/shop/cartHelper';

const baseUrl = config.baseUrl;

test('Add To Cart', async () => {
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
            dir: 'videos/shop/cart/',
            size: { width: 1280, height: 720 }
        }
    });

    const page = await context.newPage();

    try {
        await page.goto(`${baseUrl}`);

        console.log('Add to cart');

        await addToCart(page);

    } catch (error) {
        console.error('Error during test execution:', error.message);
    } finally {
        await page.close();
        await context.close();
        await browser.close();
    }
});
