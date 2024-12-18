import { test, expect } from '@playwright/test';
import config from '../../Config/config';

test('Add To Wishlist', async ({page}) => {
  await page.goto(`${config.baseUrl}`);
  await page.locator('div:nth-child(2) > .-mt-9 > .action-items > span').first().click();
});

test('Remove from Wishlist', async ({page}) => {
  await page.goto(`${config.baseUrl}`);
  await page.locator('div:nth-child(2) > .-mt-9 > .action-items > span').first().click();
});
