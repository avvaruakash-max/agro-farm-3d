const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  const filePath = 'file://' + path.resolve(__dirname, '../index.html');
  await page.goto(filePath, { waitUntil: 'networkidle0' });
  await page.waitForTimeout(1000);
  
  for (let i = 1; i <= 10; i++) {
    const num = String(i).padStart(2, '0');
    await page.screenshot({ path: path.join(__dirname, `slide-${num}.png`), fullPage: false });
    console.log(`Captured slide ${i}`);
    
    if (i < 10) {
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(800);
    }
  }
  
  await browser.close();
  console.log('Done!');
})();
