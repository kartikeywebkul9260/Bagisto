import config  from '../../Config/config';
import * as readlineSync from 'readline-sync';
import * as forms from '../shop/formHelper';

const baseUrl = config.baseUrl;

let count = 0;

const logIn = async (page) => {
    const userInput = config.userInput;
    await page.goto(`${baseUrl}/customer/login`);

    const email = userInput ? readlineSync.question('Enter the Email: ') : config.customerEmail;
    const password = userInput ? readlineSync.question('Enter the Password: ') : config.customerPassword;

    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);

    await page.press('input[name="password"]', 'Enter');

    if (await forms.testForm(page)) {
        console.log('Successfully login');
        return 'Successfully login';
    } else if(count == 0) {
        console.log('Tring to Register and login again.....');

        await page.goto(`${baseUrl}/customer/register`);

        await page.fill('input[name="first_name"]', forms.form.firstName);
        await page.fill('input[name="last_name"]', forms.form.lastName);
        const email = config.customerEmail;
        await page.fill('input[name="email"]', email);
        const pass = config.customerPassword;
        await page.fill('input[name="password"]', pass);
        await page.fill('input[name="password_confirmation"]', pass);

        await page.press('input[name="password_confirmation"]', 'Enter');

        await page.waitForSelector('div#not_available', { timeout: 8000 }).catch(() => null);

        count++;

        return logIn(page);
    } else {
        return null;
    }
}

export default logIn;
