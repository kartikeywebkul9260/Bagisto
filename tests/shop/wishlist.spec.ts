import { test, expect } from '@playwright/test';
import config from '../../Config/config';

test('Add To Wishlist', async ({page}) => {
  await page.goto(`${config.baseUrl}`);
  await page.locator('.action-items > span').first().click();
  await page.locator('div:nth-child(2) > .-mt-9 > .action-items > span').first().click();
  await page.locator('div:nth-child(3) > .-mt-9 > .action-items > span').first().click();
  await page.locator('div:nth-child(9) > div:nth-child(2) > div > .-mt-9 > .action-items > span').first().click();
  await page.locator('div:nth-child(9) > div:nth-child(2) > div:nth-child(2) > .-mt-9 > .action-items > span').first().click();
  await page.locator('div:nth-child(9) > div:nth-child(2) > div:nth-child(3) > .-mt-9 > .action-items > span').first().click();
  try {
    await page.waitForNavigation({ timeout: 5000 });
    console.log(page.url());
  } catch(e) {
    console.log(page.url());
  }
});

test('Remove from Wishlist', async ({page}) => {
  await page.goto(`${config.baseUrl}`);
  await page.locator('div:nth-child(2) > .-mt-9 > .action-items > span').first().click();
  try {
    await page.waitForNavigation({ timeout: 5000 });
    console.log(page.url());
  } catch(e) {
    console.log(page.url());
  }
});
