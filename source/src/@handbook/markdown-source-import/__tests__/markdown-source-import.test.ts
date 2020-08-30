import { markdownSourceImport, processor } from '@handbook/markdown-source-import';
import { copyTmpDirectory, createTmpDirectory } from '@ssen/tmp-directory';
import { exec } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import prettier from 'prettier';

function format(code: string): string {
  return prettier.format(code, { parser: 'markdown' });
}

describe('processor', () => {
  test.skip('!!SNAPSHOT CREATION TASK', async () => {
    process.env.__SNAPSHOTS_DIRECTORY = await createTmpDirectory();

    const filepath: string = path.resolve(process.cwd(), 'test/fixtures/magic-comments/0.source.md');
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

    const outputMarkdown: string = format(file.contents as string);

    fs.writeFileSync(path.join(process.env.__SNAPSHOTS_DIRECTORY, '0.source.md'), input, {
      encoding: 'utf8',
    });

    fs.writeFileSync(path.join(process.env.__SNAPSHOTS_DIRECTORY, '5.output.md'), outputMarkdown, {
      encoding: 'utf8',
    });

    exec(`open ${process.env.__SNAPSHOTS_DIRECTORY}`);
    exec(
      `webstorm diff ${process.env.__SNAPSHOTS_DIRECTORY} ${path.resolve(
        process.cwd(),
        'test/fixtures/magic-comments',
      )}`,
    );

    process.env.__SNAPSHOTS_DIRECTORY = undefined;
  });

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

  test('should find all paths', async () => {
    const source = path.resolve(process.cwd(), 'test/fixtures/source-import-paths');
    const cwd = await copyTmpDirectory(source);

    await markdownSourceImport({
      cwd,
      filePatterns: ['*.md', '**/*.md'],
    });

    //exec(`webstorm diff ${cwd} ${path.resolve(process.cwd(), 'test/fixtures/source-import-paths')}`);
    //exec(`open ${cwd}`);

    function diff(dir: string) {
      const inputPath = path.resolve(cwd, dir, 'doc.md');
      const outputPath = path.resolve(
        process.cwd(),
        'test/fixtures/source-import-paths-output',
        dir,
        'doc.md',
      );

      const input: string = fs.readFileSync(inputPath, 'utf8');
      const output: string = fs.readFileSync(outputPath, 'utf8');

      expect(output).toBe(input);
    }

    diff('');
    diff('src');
    diff('src/a');
    diff('src/a/b');
    diff('src/a/b/d');
  });
});
