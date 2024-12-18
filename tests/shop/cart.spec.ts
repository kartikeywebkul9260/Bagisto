import { test, expect } from '@playwright/test';
import config from '../../Config/config';

test('Add to cart', async ({ page }) => {
  await page.goto(`${config.baseUrl}`);
  await page.locator('#main div').filter({ hasText: 'New Products View All New' }).locator('button').first().click();
  await page.locator('.icon-cancel').first().click();
});
