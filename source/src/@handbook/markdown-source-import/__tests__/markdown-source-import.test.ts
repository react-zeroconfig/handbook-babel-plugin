import { markdownSourceImport, processor } from '@handbook/markdown-source-import';
import { copyTmpDirectory } from '@ssen/tmp-directory';
import fs from 'fs-extra';
import path from 'path';
import prettier from 'prettier';

function format(code: string): string {
  return prettier.format(code, { parser: 'markdown' });
}

describe('processor', () => {
  test('should transform source to output', async () => {
    const filepath: string = path.resolve(process.cwd(), 'test/fixtures/magic-comments/0.source.md');
    const source = await fs.readFile(filepath, {
      encoding: 'utf8',
    });
    const input: string = format(source);
    const output: string = await fs.readFile(
      path.resolve(process.cwd(), 'test/fixtures/magic-comments/5.output.md'),
      { encoding: 'utf8' },
    );

    const file = await processor.process({
      contents: input,
      path: filepath,
      basename: path.basename(filepath),
      extname: path.extname(filepath),
      dirname: path.dirname(filepath),
      cwd: process.cwd(),
    });

    expect(format(file.contents as string)).toBe(format(output));
  });

  test('should re-transform output to output', async () => {
    const filepath: string = path.resolve(process.cwd(), 'test/fixtures/magic-comments/5.output.md');
    const source = await fs.readFile(filepath, {
      encoding: 'utf8',
    });
    const input: string = format(source);

    const file = await processor.process({
      contents: input,
      path: filepath,
      basename: path.basename(filepath),
      extname: path.extname(filepath),
      dirname: path.dirname(filepath),
      cwd: process.cwd(),
    });

    expect(format(file.contents as string)).toBe(input);
  });
});

describe('markdownSourceImport()', () => {
  test('should transform all files', async () => {
    const source = path.resolve(process.cwd(), 'test/fixtures/magic-comments');
    const cwd = await copyTmpDirectory(source);

    await markdownSourceImport({
      cwd,
      filePatterns: ['./*.md'],
    });

    const a: string = await fs.readFile(path.resolve(source, '5.output.md'), {
      encoding: 'utf8',
    });
    const b: string = await fs.readFile(path.resolve(cwd, '0.source.md'), {
      encoding: 'utf8',
    });

    expect(format(a)).toBe(format(b));
  });
});
