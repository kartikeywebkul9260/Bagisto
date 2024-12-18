import { test, expect } from '@playwright/test';
import config from '../../Config/config';

test('register', async ({ page }) => {
  await page.goto(`${config.baseUrl}`);
  await page.getByLabel('Profile').click();
  await page.getByRole('link', { name: 'Sign Up' }).click();
  await page.getByPlaceholder('First Name').click();
  await page.getByPlaceholder('First Name').fill('Rahul');
  await page.getByPlaceholder('Last Name').click();
  await page.getByPlaceholder('Last Name').fill('Kumar');
  await page.getByPlaceholder('email@example.com').click();
  await page.getByPlaceholder('email@example.com').fill('rahul@gmail.com');
  await page.getByPlaceholder('Password', { exact: true }).click();
  await page.getByPlaceholder('Password', { exact: true }).fill('rahul@123');
  await page.getByPlaceholder('Confirm Password').click();
  await page.getByPlaceholder('Confirm Password').fill('rahul@123');
  await page.locator('#main form div').filter({ hasText: 'Subscribe to newsletter' }).locator('label').first().click();
  await page.getByRole('button', { name: 'Register' }).click();
  await page.getByText('Account created successfully.').first().click();
});

test('login', async ({ page }) => {
  await page.goto(`${config.baseUrl}`);
  await page.getByLabel('Profile').click();
  await page.getByRole('link', { name: 'Sign In' }).click();
  await page.getByPlaceholder('email@example.com').click();
  await page.getByPlaceholder('email@example.com').fill('rahul@gmail.com');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('rahul@123');
  await page.getByRole('button', { name: 'Sign In' }).click();
});

test('logout', async ({ page }) => {
  await page.goto(`${config.baseUrl}`);
  await page.getByLabel('Profile').click();
  await page.getByRole('link', { name: 'Sign In' }).click();
  await page.getByPlaceholder('email@example.com').click();
  await page.getByPlaceholder('email@example.com').fill('');
  await page.getByPlaceholder('email@example.com').press('CapsLock');
  await page.getByPlaceholder('email@example.com').fill('rahul@gmail.com');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('rahul@123');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.getByLabel('Profile').click();
  await page.getByRole('link', { name: 'Logout' }).click();
});
