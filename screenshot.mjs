import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();
try {
  await page.goto('http://localhost:4200', { waitUntil: 'networkidle', timeout: 15000 });
} catch (e) {
  console.log('Page loaded (navigation:', e.message + ')');
}
await page.screenshot({ path: '/tmp/app.png' });
console.log('Screenshot saved to /tmp/app.png');
const title = await page.title();
console.log('Page title:', title);
const body = await page.locator('body').textContent();
console.log('Body content preview:', body?.substring(0, 200));
await browser.close();
