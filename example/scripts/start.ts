import { getBrowserslistQuery } from '@rocket-scripts/browserslist';
import { start } from '@rocket-scripts/web';
import puppeteer from 'puppeteer';

(async () => {
  const remoteDebuggingPort: number = +(process.env.INSPECT_CHROME ?? 9222);

  const { port } = await start({
    app: 'app',
    webpackConfig: {
      externals: {
        typescript: 'ts',
      },
    },
    babelLoaderOptions: {
      presets: [
        [
          require.resolve('@rocket-scripts/react-preset/babelPreset'),
          {
            modules: false,
            targets: getBrowserslistQuery({ cwd: process.cwd() }),
          },
        ],
      ],
      plugins: [require.resolve('@handbook/babel-plugin')],
    },
  });

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-fullscreen', `--remote-debugging-port=${remoteDebuggingPort}`],
    devtools: true,
  });

  const [page] = await browser.pages();
  await page.goto(`http://localhost:${port}`);
})();
