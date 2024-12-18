import { test, expect } from '@playwright/test';
import config from '../../Config/config';

test('Login', async ({page}) => {
  await page.goto(`${config.baseUrl}/admin/login`);
  await page.getByPlaceholder('Email Address').click();
  await page.getByPlaceholder('Email Address').fill('admin@example.com');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('admin123');
  await page.getByLabel('Sign In').click();
});

test('Logout', async ({page}) => {
  await page.goto(`${config.baseUrl}/admin/login`);
  await page.getByPlaceholder('Email Address').click();
  await page.getByPlaceholder('Email Address').fill('admin@example.com');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('admin123');
  await page.getByLabel('Sign In').click();
  await page.getByRole('button', { name: 'E' }).click();
  await page.getByRole('link', { name: 'Logout' }).click();
});
