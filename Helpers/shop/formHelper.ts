import config from "../../Config/config";

const fs = require('fs');
const path = require('path');

function getRandomImageFile(directory = path.resolve(__dirname, '../../packages/Webkul/Shop/src/Resources/assets/images/')) {
    if (!fs.existsSync(directory)) {
        throw new Error(`Directory does not exist: ${directory}`);
    }

    const files = fs.readdirSync(directory); // Read all files in the directory
    const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file)); // Filter image files

    if (imageFiles.length === 0) {
        throw new Error('No image files found in the directory.');
    }

    const randomIndex = Math.floor(Math.random() * imageFiles.length); // Pick a random index
    return path.join(directory, imageFiles[randomIndex]); // Return the full path of the random image
}

const testForm = async (page) => {
    const getError = await page.waitForSelector('.text-red-500.text-xs.italic', { timeout: 2000 }).catch(() => null);
    var message = '';

    if (getError) {
        const errors = await page.$$('.text-red-500.text-xs.italic');

        for (let error of errors) {
            message = await error.evaluate(el => el.innerText);
            console.log(message);
        }
        return null;
    } else {
        const iconExists = await page.waitForSelector('.break-words + .icon-cancel', { timeout: 5000 }).catch(() => null);

        if (iconExists) {
            const icons = await page.$$('.break-words + .icon-cancel');

            message = await icons[0].evaluate(el => el.parentNode.innerText);
            await icons[0].click();
            console.log(message);
            return null;
        } else {
            return page.url();
        }
    }
}

const isValid = config.validInputs;

const form = {
    firstName: isValid
        ? `Test${Math.random().toString(36).substring(7)}`
        : `123${Math.random().toString(36).substring(7)}`, // Invalid: Starts with numbers
    lastName: isValid
        ? `User${Math.random().toString(36).substring(7)}`
        : `@User${Math.random().toString(36).substring(7)}`, // Invalid: Contains special characters
    email: isValid
        ? `test${Math.random().toString(36).substring(7)}@example.com`
        : `test${Math.random().toString(36).substring(7)}example.com`, // Invalid: Missing "@"
    phone: isValid
        ? `555${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}`
        : `55a${Math.floor(Math.random() * 10000000).toString().padStart(6, '0')}`, // Invalid: Contains letters
};

function generateRandomPassword(minLength, maxLength) {
    if (isValid) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
        const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
        let password = '';

        for (let i = 0; i < length; i++) {
            password += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        return password;
    } else {
        const invalidCharacters = '€£¥©®✓';
        const randomInvalidCharacter = invalidCharacters.charAt(Math.floor(Math.random() * invalidCharacters.length));

        // Invalid case: Length less than `minLength`
        if (Math.random() < 0.5) {
            const shortPassword = randomInvalidCharacter.repeat(minLength - 1);
            return shortPassword;
        }

        // Invalid case: Length greater than `maxLength`
        const longPassword = randomInvalidCharacter.repeat(maxLength + 1);
        return longPassword;
    }
}

export { form, testForm, generateRandomPassword, getRandomImageFile };
