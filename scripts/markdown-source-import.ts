import { markdownSourceImport } from '@handbook/markdown-source-import';
import yargs from 'yargs';

const argv = yargs.argv;

(async () => {
  await markdownSourceImport({
    cwd: process.cwd(),
    filePatterns: ['README.md', 'source/README.md', 'source/src/**/*.md'],
    gitAdd: !!argv['git-add'],
  });
})();
