import config  from '../../Config/config';
import * as readlineSync from 'readline-sync';
import * as forms from '../admin/formHelper';

const baseUrl = config.baseUrl;

const logIn = async (page) => {
    const userInput = config.userInput;
    await page.goto(`${baseUrl}/admin/login`);

    const email = userInput ? readlineSync.question('Enter the Email: ') : config.adminEmail;
    const password = userInput ? readlineSync.question('Enter the Password: ') : config.adminPassword;
    
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