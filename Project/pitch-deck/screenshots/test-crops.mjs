import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set a good presentation resolution
  await page.setViewport({ width: 1440, height: 900 });

  // Load the pitch deck
  const filePath = `file://${path.join(__dirname, '..', 'index.html')}`;
  await page.goto(filePath, { waitUntil: 'networkidle0' });

  // Navigate to slide 5 (index 4)
  await page.evaluate(() => {
    // Access the instance via a small hack or just simulate key presses
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
  });
  await new Promise(r => setTimeout(r, 700));
  await page.evaluate(() => { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' })); });
  await new Promise(r => setTimeout(r, 700));
  await page.evaluate(() => { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' })); });
  await new Promise(r => setTimeout(r, 700));
  await page.evaluate(() => { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' })); });
  await new Promise(r => setTimeout(r, 700));

  // Take screenshot of Slide 5 (Crops We Grow)
  await page.screenshot({ path: path.join(__dirname, 'test-slide-05-crops.png') });
  
  console.log("Screenshot saved to: test-slide-05-crops.png");
  await browser.close();
})();
