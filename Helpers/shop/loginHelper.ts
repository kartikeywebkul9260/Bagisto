import config  from '../../Config/config';
import * as readlineSync from 'readline-sync';
import * as forms from '../shop/formHelper';

const baseUrl = config.baseUrl;

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
    } else {
        return null;
    }
}

export default logIn;