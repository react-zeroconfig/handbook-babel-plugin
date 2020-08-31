import { glob } from '@ssen/promised';
import * as fs from 'fs-extra';
import flatten from 'lodash.flattendeep';
import path from 'path';
import prettier from 'prettier';
import git from 'simple-git';
import unified from 'unified';

export interface MarkdownSourceImportParams {
  cwd?: string;
  filePatterns: string[];
  ignore?: string[];
  gitAdd?: boolean;
}

export const processor = unified()
  .use(require('remark-parse'))
  .use(require('@handbook/remark-split-html-lines'))
  .use(require('@handbook/remark-magic-comments'))
  .use(require('remark-stringify'), {
    listItemIndent: 1,
  });

export async function markdownSourceImport({
  cwd = process.cwd(),
  filePatterns,
  ignore = ['**/node_modules/**', './node_modules/**'],
  gitAdd = false,
}: MarkdownSourceImportParams) {
  const files: string[] = await Promise.all(
    filePatterns.map((pattern) =>
      glob(`${cwd}/${pattern}`, {
        ignore,
      }),
    ),
  ).then((...group) => flatten(group));

  for (const file of files) {
    const input: string = await fs.readFile(file, 'utf8');

    const { contents } = await processor.process({
      contents: input,
      path: file,
      basename: path.basename(file),
      extname: path.extname(file),
      dirname: path.dirname(file),
      cwd,
    });

    if (typeof contents === 'string') {
      const config: prettier.Options | null = await prettier.resolveConfig(
        file,
        { useCache: true },
      );
      const next: string = prettier.format(contents, {
        singleQuote: true,
        trailingComma: 'all',
        ...config,
        parser: 'markdown',
      });

      if (next !== input && next.length > 0) {
        await fs.writeFile(file, next, { encoding: 'utf8' });

        try {
          if (gitAdd) {
            await git(cwd).add(file);
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
  }
}
