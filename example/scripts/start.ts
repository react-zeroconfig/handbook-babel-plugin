import { start } from '@rocket-scripts/web';
import puppeteer from 'puppeteer';
import { options } from '../scripts/options';

(async () => {
  const remoteDebuggingPort: number = +(process.env.INSPECT_CHROME ?? 9222);

  const { port } = await start({
    app: 'app',
    ...options,
  });

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: [
      '--start-fullscreen',
      `--remote-debugging-port=${remoteDebuggingPort}`,
    ],
    devtools: true,
  });

  const [page] = await browser.pages();
  await page.goto(`http://localhost:${port}`);
})();
