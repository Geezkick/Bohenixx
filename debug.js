const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.error('PAGE ERROR:', error.message));
  page.on('requestfailed', request =>
    console.log('REQUEST FAILED:', request.url(), request.failure().errorText)
  );

  console.log('Navigating to https://bohenix.africa...');
  await page.goto('https://bohenix.africa', { waitUntil: 'networkidle2' });
  
  console.log('Checking for React Error Overlay...');
  const errorOverlay = await page.evaluate(() => {
    return document.querySelector('nextjs-portal') !== null || document.body.innerText.includes('Application error');
  });
  console.log('React Error Overlay or App Error:', errorOverlay);
  
  await browser.close();
})();
