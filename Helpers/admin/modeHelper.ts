import config  from '../../Config/config';

const mode = async (page) => {
  const exists = await page.waitForSelector('.cursor-pointer.rounded-md.text-2xl.transition-all.icon-light:visible', { timeout: 500 }).catch(() => null);

  if (
        exists 
        && (
            ! config.darkMode
        )
    ) {
    await page.click('.cursor-pointer.rounded-md.text-2xl.transition-all.icon-light:visible');
    console.log('Light mode');
  } else if (
        config.darkMode
        && (
            ! exists
        )
    ) {
    await page.click('.cursor-pointer.rounded-md.text-2xl.transition-all.icon-dark:visible');
    console.log('Dark mode');
  }
}

export default mode;