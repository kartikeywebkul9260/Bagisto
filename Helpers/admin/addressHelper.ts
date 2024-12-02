import * as readlineSync from 'readline-sync';
import * as forms from '../admin/formHelper';
import config  from '../../Config/config';

const address = async (page) => {
    const userInput = config.userInput;

    await page.fill('input[name="billing.company_name"]', userInput ? readlineSync.question('Enter the Company Name: ') : forms.form.lastName);
    await page.fill('input[name="billing.first_name"]', userInput ? readlineSync.question('Enter the First Name: ') : forms.form.firstName);
    await page.fill('input[name="billing.last_name"]', userInput ? readlineSync.question('Enter the Last Name: ') : forms.form.lastName);
    await page.fill('input[name="billing.email"]', userInput ? readlineSync.question('Enter the Email: ') : forms.form.email);
    await page.fill('input[name="billing.address.[0]"]', userInput ? readlineSync.question('Enter the address: ') : forms.form.firstName);
    await page.selectOption('select[name="billing.country"]', 'IN');
    await page.selectOption('select[name="billing.state"]', 'UP');
    await page.fill('input[name="billing.city"]', userInput ? readlineSync.question('Enter the City Name: ') : forms.form.lastName);
    await page.fill('input[name="billing.postcode"]', '201301');
    await page.fill('input[name="billing.phone"]', userInput ? readlineSync.question('Enter the Contact Number: ') : forms.form.phone);

    const exists = await page.$$('input[name="billing.save_address"]');

    if (exists.length != 0) {
        await page.click('input[name="billing.save_address"] + label');
        await page.press('input[name="billing.phone"]', 'Enter');
    } else {
        const checkbox = await page.$$('input[name="billing.use_for_shipping"]');
        
        if (Math.floor(Math.random() * 20) % 3 == 1 ? false : true) {
            if (! checkbox[0].isChecked()) {
                await page.click('input[name="billing.use_for_shipping"] + label');
            }
        } else {
            const userInput = config.userInput;
            
            if (checkbox[0].isChecked()) {
                await page.click('input[name="billing.use_for_shipping"] + label');
            }

            await page.fill('input[name="shipping.company_name"]', userInput ? readlineSync.question('Enter the Company Name: ') : forms.form.lastName);
            await page.fill('input[name="shipping.first_name"]', userInput ? readlineSync.question('Enter the First Name: ') : forms.form.firstName);
            await page.fill('input[name="shipping.last_name"]', userInput ? readlineSync.question('Enter the Last Name: ') : forms.form.lastName);
            await page.fill('input[name="shipping.email"]', userInput ? readlineSync.question('Enter the Email: ') : forms.form.email);
            await page.fill('input[name="shipping.address.[0]"]', userInput ? readlineSync.question('Enter the address: ') : forms.form.firstName);
            await page.selectOption('select[name="shipping.country"]', 'IN');
            await page.selectOption('select[name="shipping.state"]', 'UP');
            await page.fill('input[name="shipping.city"]', userInput ? readlineSync.question('Enter the City Name: ') : forms.form.lastName);
            await page.fill('input[name="shipping.postcode"]', '201301');
            await page.fill('input[name="shipping.phone"]', userInput ? readlineSync.question('Enter the Contact Number: ') : forms.form.phone);
        }

        const nextButton = await page.$$('button.primary-button:visible');
        await nextButton[0].click();
    }
    
    const output = await forms.testForm(page)

    if (output == null) {
        return address(page);
    } else {
        return 'done';
    }
}

export default address;