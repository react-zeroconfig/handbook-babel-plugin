import * as process from 'process';
import yargs, { Argv } from 'yargs';
import { markdownSourceImport } from './';

const cwd: string = process.cwd();

type Options = Parameters<Argv['options']>[0];

const options: Options = {
  emit: {
    type: 'boolean',
    default: true,
    describe:
      'if you set this false it will only print options without run (e.g. --no-emit or --emit false)',
  },
  'git-add': {
    type: 'boolean',
    default: false,
    describe: 'set --git-add ',
  },
};

export function run() {
  const argv = yargs
    .options(options)
    .example('$0 doc.md', 'transform single document')
    .example('$0 doc1.md doc2.md', 'transform multiple documents')
    .example('$0 ./*.md', 'transform multiple documents by glob pattern')
    .wrap(null)
    .help('h')
    .alias('h', 'help')
    .epilog('🚀 Handbook!').argv;

  const { _: filePatterns, emit, gitAdd } = argv;

  if (!Array.isArray(filePatterns) || filePatterns.length === 0) {
    throw new Error('Undefined filePatterns!');
  }

  const params = {
    cwd,
    filePatterns: filePatterns.filter(
      (filePattern): filePattern is string => typeof filePattern === 'string',
    ),
    gitAdd: gitAdd === true,
  };

  if (emit) {
    markdownSourceImport(params);
  } else {
    console.log(params);
  }
}
