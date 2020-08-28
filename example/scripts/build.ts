import { build } from '@rocket-scripts/web';
import { rimraf } from '@ssen/promised';
import path from 'path';
import { options } from '../scripts/options';

(async () => {
  const outDir: string = path.resolve(__dirname, '../../out/example');

  await rimraf(outDir);

  await build({
    app: 'app',
    outDir,
    ...options,
  });
})();
