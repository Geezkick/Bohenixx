import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.error('BROWSER ERROR:', err.message));
  
  try {
    await page.goto('https://bohenix.africa', { waitUntil: 'networkidle0' });
  } catch(e) {
    console.error('NAV ERROR:', e);
  }
  
  await browser.close();
})();
