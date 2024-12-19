import { test, expect } from '@playwright/test';
import config from '../../Config/config';

test('Customer CheckOut', async ({page}) => {
  await page.goto(`${config.baseUrl}`);
  await page.getByLabel('Profile').click();
  await page.getByRole('link', { name: 'Sign In' }).click();
  await page.getByPlaceholder('email@example.com').click();
  await page.getByPlaceholder('email@example.com').fill('testUser@gmail.com');
  await page.getByPlaceholder('email@example.com').press('Tab');
  await page.getByPlaceholder('Password').fill('testUser@123');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.locator('#main div').filter({ hasText: 'New Products View All New' }).locator('button').nth(2).click();
  await page.locator('#main div').filter({ hasText: 'New Products View All New' }).locator('button').first().click();
  await page.goto(`${config.baseUrl}/checkout/onepage`);
  await page.getByPlaceholder('Company Name').click();
  await page.getByPlaceholder('Company Name').fill('Example');
  await page.getByPlaceholder('First Name').click();
  await page.getByPlaceholder('First Name').fill('Test');
  await page.getByPlaceholder('Last Name').click();
  await page.getByPlaceholder('Last Name').fill('User');
  await page.getByPlaceholder('email@example.com').click();
  await page.getByPlaceholder('email@example.com').fill('webkul@example.com');
  await page.getByPlaceholder('Street Address').click();
  await page.getByPlaceholder('Street Address').fill('demo');
  await page.locator('select[name="billing\\.country"]').selectOption('AQ');
  await page.getByPlaceholder('State').click();
  await page.getByPlaceholder('State').fill('any');
  await page.getByPlaceholder('City').click();
  await page.getByPlaceholder('City').fill('any');
  await page.getByPlaceholder('Zip/Postcode').click();
  await page.getByPlaceholder('Zip/Postcode').fill('123456');
  await page.getByPlaceholder('Telephone').click();
  await page.getByPlaceholder('Telephone').fill('9876543210');
  await page.locator('#save_address').nth(1).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await page.locator('#use_for_shipping').nth(1).click();
  await page.getByRole('button', { name: ' Add new address' }).click();
  await page.locator('#steps-container form div').filter({ hasText: 'Shipping Address User' }).getByRole('button').click();
  await page.getByPlaceholder('Company Name').click();
  await page.getByPlaceholder('Company Name').fill('webkul');
  await page.getByPlaceholder('First Name').click();
  await page.getByPlaceholder('First Name').fill('webkul');
  await page.getByPlaceholder('Last Name').click();
  await page.getByPlaceholder('Last Name').fill('jasdgh');
  await page.getByPlaceholder('email@example.com').click();
  await page.getByPlaceholder('email@example.com').fill('Demo_awsdas@jsj.sdf');
  await page.locator('#steps-container form div').filter({ hasText: 'Street Address' }).nth(1).click();
  await page.getByPlaceholder('Street Address').fill('Demo_sdfs sdhgd');
  await page.locator('select[name="shipping\\.country"]').selectOption('AW');
  await page.getByPlaceholder('State').click();
  await page.getByPlaceholder('State').fill('Demo_sdfsadfs');
  await page.getByPlaceholder('City').click();
  await page.getByPlaceholder('City').fill('Demo_sdfsadfwe');
  await page.getByPlaceholder('Zip/Postcode').click();
  await page.getByPlaceholder('Zip/Postcode').fill('Demo_fqwe');
  await page.getByPlaceholder('Telephone').click();
  await page.getByPlaceholder('Telephone').fill('31452345345');
  await page.locator('#save_address').nth(1).click();
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByPlaceholder('Zip/Postcode').click();
  await page.getByPlaceholder('Zip/Postcode').click();
  await page.getByPlaceholder('Zip/Postcode').fill('123214');
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByText('User _test (webkul) 123ghds, noida, UP, IN,').nth(1).click();
  await page.getByRole('button', { name: 'Proceed' }).click();
  await page.locator('label').filter({ hasText: '$20.00Flat Rate - Flat Rate' }).click();
  await page.locator('label').filter({ hasText: 'Cash On DeliveryCash On' }).click();
  await page.getByRole('button', { name: 'Place Order' }).click();
  try {
    await page.waitForNavigation({ timeout: 5000 });
    console.log(page.url());
  } catch(e) {
    console.log(page.url());
  }
});

test('Guest CheckOut', async ({page}) => {
  await page.goto(`${config.baseUrl}`);
  await page.locator('#main div').filter({ hasText: 'New Products View All New' }).locator('button').first().click();
  await page.locator('#main div').filter({ hasText: 'New Products View All New' }).locator('button').nth(1).click();
  await page.locator('#main div').filter({ hasText: 'New Products View All New' }).locator('button').nth(2).click();
  await page.goto(`${config.baseUrl}/checkout/onepage`);
  await page.getByPlaceholder('Company Name').click();
  await page.getByPlaceholder('Company Name').fill('WEBKUL');
  await page.getByPlaceholder('First Name').click();
  await page.getByPlaceholder('First Name').fill('Demo_ASHGDAS');
  await page.getByPlaceholder('First Name').press('Tab');
  await page.getByPlaceholder('Last Name').fill('Demo_JASGDSH');
  await page.getByPlaceholder('Last Name').press('Tab');
  await page.getByRole('textbox', { name: 'email@example.com' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'email@example.com' }).fill('Demo_ashdghsd@hjdg.sad');
  await page.getByRole('textbox', { name: 'email@example.com' }).press('Tab');
  await page.getByPlaceholder('Street Address').fill('Demo_sdhgfs2367');
  await page.getByPlaceholder('Street Address').press('Tab');
  await page.locator('select[name="billing\\.country"]').selectOption('AI');
  await page.getByPlaceholder('State').click();
  await page.getByPlaceholder('State').fill('Demo_sfsyftg');
  await page.getByPlaceholder('City').click();
  await page.getByPlaceholder('City').fill('Demo_dgwuyeg');
  await page.getByPlaceholder('Zip/Postcode').click();
  await page.getByPlaceholder('Zip/Postcode').fill('Demo_djsbfuweh');
  await page.getByPlaceholder('Telephone').click();
  await page.getByPlaceholder('Telephone').fill('9023723564');
  await page.getByRole('button', { name: 'Proceed' }).click();
  await page.getByPlaceholder('Zip/Postcode').click();
  await page.getByPlaceholder('Zip/Postcode').fill('2673854');
  await page.getByRole('button', { name: 'Proceed' }).click();
  await page.locator('label').filter({ hasText: '$30.00Flat Rate - Flat Rate' }).click();
  await page.locator('label').filter({ hasText: 'Cash On DeliveryCash On' }).click();
  await page.getByRole('button', { name: 'Place Order' }).click();
  try {
    await page.waitForNavigation({ timeout: 5000 });
    console.log(page.url());
  } catch(e) {
    console.log(page.url());
  }
});
