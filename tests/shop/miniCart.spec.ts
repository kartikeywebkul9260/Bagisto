import { test, expect } from '@playwright/test';
import config from '../../Config/config';

test('Increment', async ({ page }) => {
  await page.goto(`${config.baseUrl}`);
  await page.locator('#main div').filter({ hasText: 'New Products View All New' }).locator('button').first().click();
  await page.locator('.icon-cancel').first().click();
  await page.getByRole('button', { name: 'Shopping Cart' }).click();
  await page.getByRole('button', { name: 'Increase Quantity' }).click();
  await page.getByRole('button', { name: 'Increase Quantity' }).click();
  await page.locator('.icon-cancel').first().click();
});

test('Decrement', async ({ page }) => {
  await page.goto(`${config.baseUrl}`);
  await page.locator('#main div').filter({ hasText: 'New Products View All New' }).locator('button').nth(2).click();
  await page.locator('.icon-cancel').first().click();
  await page.getByRole('button', { name: 'Shopping Cart' }).click();
  await page.getByRole('button', { name: 'Increase Quantity' }).click();
  await page.getByRole('button', { name: 'Increase Quantity' }).click();
  await page.getByRole('button', { name: 'Decrease Quantity' }).click();
  await page.getByRole('button', { name: 'Decrease Quantity' }).click();
  await page.getByRole('button', { name: 'Decrease Quantity' }).click();
  await page.locator('.icon-cancel').first().click();
});

test('Remove', async ({ page }) => {
  await page.goto(`${config.baseUrl}`);
  await page.locator('#main div').filter({ hasText: 'New Products View All New' }).locator('button').nth(2).click();
  await page.getByRole('button', { name: 'Shopping Cart' }).click();
  await page.getByRole('button', { name: 'Remove' }).click();
  await page.getByRole('button', { name: 'Agree', exact: true }).click();
  await page.locator('.icon-cancel').first().click();
});
