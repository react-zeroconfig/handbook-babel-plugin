import plugin from '@handbook/remark-split-html-lines';
import { transform } from '@handbook/remark-split-html-lines/transform';
import fs from 'fs-extra';
import path from 'path';

describe('transform', () => {
  test('should transform node', async () => {
    // Arrange
    const input = await fs.readJson(
      path.resolve(process.cwd(), 'test/fixtures/magic-comments/1.parse.json'),
    );
    const output = await fs.readJson(
      path.resolve(
        process.cwd(),
        'test/fixtures/magic-comments/2.split-line.json',
      ),
    );

    // Act
    const next = await transform(input);

    // Assert
    expect(JSON.stringify(next)).toBe(JSON.stringify(output));
  });

  test('should transform node', async () => {
    // Arrange
    const input = await fs.readJson(
      path.resolve(process.cwd(), 'test/fixtures/magic-comments/1.parse.json'),
    );
    const output = await fs.readJson(
      path.resolve(
        process.cwd(),
        'test/fixtures/magic-comments/2.split-line.json',
      ),
    );

    // Act
    //@ts-ignore
    const next = await plugin()(input);

    // Assert
    expect(JSON.stringify(next)).toBe(JSON.stringify(output));
  });
});
