import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080 });

const filePath = 'file://' + path.resolve(__dirname, '../index.html');
await page.goto(filePath, { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 1500));

// Go forward to Slide 2
await page.keyboard.press('ArrowRight');
await new Promise(r => setTimeout(r, 1000));
console.log('Navigated forward to Slide 2');

// Go backward to Slide 1
await page.keyboard.press('ArrowLeft');
await new Promise(r => setTimeout(r, 1000));
console.log('Navigated backward to Slide 1');

// Take screenshot of Slide 1
await page.screenshot({ path: path.join(__dirname, 'test-slide-01-after-prev.png') });
console.log('Slide 1 screenshot after going backward captured successfully!');

await browser.close();
