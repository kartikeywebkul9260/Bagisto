import config  from '../../Config/config';

const baseUrl = config.baseUrl;

const addToCart = async (page) => {
  await page.goto(`${baseUrl}`);
  const exists = await page.waitForSelector('.secondary-button.w-full.max-w-full.text-sm.font-medium', { timeout: 20000 }).catch(() => null);

  if (exists) {
    const buttons = await page.$$('.secondary-button.w-full.max-w-full.text-sm.font-medium');

    if (buttons.length === 0) {
      console.log('No "Add To Cart" buttons found.');
      return null;
    }
    
    const index = Math.floor(Math.random() * ((buttons.length - 1) - 0 + 1)) + 0;

    await buttons[index].click();

    const iconExists = await page.waitForSelector('.break-words + .icon-cancel', { timeout: 10000 }).catch(() => null);

    if (iconExists) {
      const icons = await page.$$('.break-words + .icon-cancel');
      
      const message = await icons[0].evaluate(el => el.parentNode.innerText);
      console.log(message);
      await icons[0].click();

      return message;
    } else {
      const exists = await page.waitForSelector('.icon-plus.cursor-pointer', { timeout: 2000 }).catch(() => null);

      if (exists) {
        const icon = await page.$$('.icon-plus.cursor-pointer');
        const quantity = Math.floor(Math.random() * ((10 - 1) - 1 + 1)) + 1;
        
        for (let i = 1; i < quantity; i++) {
          await icon[icon.length -1].click();
        }
      }

      await page.click('.secondary-button.w-full.max-w-full');
      
      const newiconExists = await page.waitForSelector('.break-words + .icon-cancel', { timeout: 10000 }).catch(() => null);

      if (newiconExists) {
        const icons = await page.$$('.break-words + .icon-cancel');
        
        const message = await icons[0].evaluate(el => el.parentNode.innerText);
        console.log(message);
        await icons[0].click();

        const error = await page.waitForSelector('.text-red-500.text-xs.italic', { timeout: 1000 }).catch(() => null);

        if (error) {
          const icons = await page.$$('.text-red-500.text-xs.italic');

          const message = await icons[0].evaluate(el => el.innerText);
          console.log(message);
          return null;
        }

        return message;
      }

      return null;
    }
  } else {
    console.log('No any Cart button exists at this page.');
    return null;
  }
};

export default addToCart;
