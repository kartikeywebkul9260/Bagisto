import config from "../../Config/config";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Derive __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getRandomImageFile(
    directory = path.resolve(__dirname, '../../packages/Webkul/Shop/src/Resources/assets/images/')
) {
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
    const getError = await page.waitForSelector('.text-red-600.text-xs.italic', { timeout: 2000 }).catch(() => null);
    var message = '';

    if (getError) {
        const errors = await page.$$('.text-red-600.text-xs.italic');

        for (let error of errors) {
            message = await error.evaluate(el => el.innerText);
            console.log(message);
        }
        return null;
    } else {
        const iconExists = await page.waitForSelector('.flex.items-center.break-all.text-sm > .icon-toast-done.rounded-full.bg-white.text-2xl', { timeout: 5000 }).catch(() => null);

        if (iconExists) {
            const messages = await page.$$('.flex.items-center.break-all.text-sm > .icon-toast-done.rounded-full.bg-white.text-2xl');
            const icons = await page.$$('.flex.items-center.break-all.text-sm + .cursor-pointer.underline');

            message = await messages[0].evaluate(el => el.parentNode.innerText);
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

function generateRandomStringWithSpaces(length) {
    if (isValid) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:,.<>?/~`\'';
        let result = '';
        for (let i = 0; i < length; i++) {
            if (Math.random() < 0.1) {
            result += ' ';
            } else {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
            }
        }
        return result;
    } else {
        const invalidCharacters = '€£¥©®✓ ';
        let result = '';

        for (let i = 0; i < length; i++) {
            result += invalidCharacters.charAt(Math.floor(Math.random() * invalidCharacters.length));
        }

        // Ensure at least one invalid characteristic
        if (Math.random() < 0.5) {
            result = ' '.repeat(length); // Only spaces
        }
        return result;
    }
}

function generateRandomProductName() {
    if (isValid) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        let result = '';
        for (let i = 1; i < 3; i++) {
            if (Math.random() < 0.1) {
            result += ' ';
            } else {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
            }
        }
        return result;
    } else {
        const invalidCharacters = '1234567890!@#$%^&*()';
        if (Math.random() < 0.5) {
            // Invalid case: Empty string
            return '';
        }

        // Invalid case: Contains invalid characters
        const length = Math.floor(Math.random() * 5) + 1; // Shorter than expected
        let result = '';
        for (let i = 0; i < length; i++) {
            result += invalidCharacters.charAt(Math.floor(Math.random() * invalidCharacters.length));
        }
        return result;
    }
}

function generateRandomHtmlContent() {
    if (isValid) {
        const elements = ['span', 'a', 'em', 'strong', 'b', 'i', 'u'];
        const randomElement = elements[Math.floor(Math.random() * elements.length)];
        const randomText = Math.random().toString(36).substring(7);
        const randomHref = `https://example.com/${Math.random().toString(36).substring(7)}`;

        switch (randomElement) {
            case 'a':
                return `<a href="${randomHref}">${randomText}</a>`;
            case 'span':
                return `<span>${randomText}</span>`;
            case 'em':
                return `<em>${randomText}</em>`;
            case 'strong':
                return `<strong>${randomText}</strong>`;
            case 'b':
                return `<b>${randomText}</b>`;
            case 'i':
                return `<i>${randomText}</i>`;
            case 'u':
                return `<u>${randomText}</u>`;
            default:
                return `<span>${randomText}</span>`;
        }
    } else {
        const invalidTags = ['<invalid>', '<unsupported>', '<>', '</>', '<div>>'];
        const randomInvalidTag = invalidTags[Math.floor(Math.random() * invalidTags.length)];

        // Random invalid text
        const randomText = Math.random().toString(36).substring(7);

        if (Math.random() < 0.5) {
            return `${randomInvalidTag}${randomText}`;
        }
        return `<${randomText}>Malformed content</${randomText}>`; // Invalid closing tag
    }
}

async function fillParagraphWithRandomHtml(multi) {
    const randomHtmlContent = new Array(multi).fill('')
        .map(() => generateRandomHtmlContent())
        .join(' ');

    return randomHtmlContent;
}

function generateRandomUrl() {
    if (isValid) {
        // Valid URL
        const protocols = ['http', 'https'];
        const domain = `example${Math.random().toString(36).substring(7)}.com`;
        const path = `/${Math.random().toString(36).substring(7)}`;
        const protocol = protocols[Math.floor(Math.random() * protocols.length)];
        return `${protocol}://${domain}${path}`;
    } else {
        // Invalid URL cases
        const invalidOptions = [
            'htp:/invalid.com',               // Invalid protocol
            '://missingprotocol.com',         // Missing protocol
            'http://invalid_domain',          // Invalid domain
            'http://example.com/<>|{}',       // Invalid characters in path
            'example.com',                    // Missing protocol
            '',                               // Empty string
        ];
        return invalidOptions[Math.floor(Math.random() * invalidOptions.length)];
    }
}
function generateRandomDateTimeRange() {
    if (isValid) {
        // Generate valid "from" and "to" dates
        const fromDate = new Date(2024, 9, 29, 12, 0, 0); // Start: 2024-10-29 12:00:00
        const toDate = new Date(2024, 10, 29, 12, 0, 0); // End: 2024-11-29 12:00:00

        // Randomize within the range
        const randomFrom = new Date(fromDate.getTime() + Math.random() * (toDate.getTime() - fromDate.getTime() - 86400000)); // Ensure `to` is at least 1 day ahead
        const randomTo = new Date(randomFrom.getTime() + Math.random() * (toDate.getTime() - randomFrom.getTime()));

        return {
            from: randomFrom.toISOString().replace("T", " ").split(".")[0],
            to: randomTo.toISOString().replace("T", " ").split(".")[0],
        };
    } else {
        // Generate invalid "from" and "to" values
        const invalidFromOptions = [
            "2024-13-29 12:00:00", // Invalid month
            "2024-10-32 12:00:00", // Invalid day
            "Invalid Date",         // Non-datetime string
            "",                     // Empty string
        ];
        const invalidToOptions = [
            "2024-11-29 25:00:00", // Invalid hour
            "2024-11-29 12:60:00", // Invalid minutes
            "2024-11-29 12:00",    // Missing seconds
            "",                    // Empty string
        ];

        const invalidFrom = invalidFromOptions[Math.floor(Math.random() * invalidFromOptions.length)];
        const invalidTo = invalidToOptions[Math.floor(Math.random() * invalidToOptions.length)];

        return { from: invalidFrom, to: invalidTo };
    }
}
export { form, getRandomImageFile, testForm, generateRandomPassword, generateRandomStringWithSpaces, fillParagraphWithRandomHtml, generateRandomProductName, generateRandomUrl, generateRandomDateTimeRange};
