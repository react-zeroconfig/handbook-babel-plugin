import { markdownSourceImport } from '@handbook/markdown-source-import';
import yargs from 'yargs';

const argv = yargs.argv;

(async () => {
  await markdownSourceImport({
    cwd: process.cwd(),
    filePatterns: ['source/README.md', 'source/src/**/*.md'],
    gitAdd: !!argv['git-add'],
  });
})();
