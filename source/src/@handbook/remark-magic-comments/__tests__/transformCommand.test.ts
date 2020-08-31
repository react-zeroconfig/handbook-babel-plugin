import { transformCommand } from '@handbook/remark-magic-comments/transformCommand';
import fs from 'fs-extra';
import path from 'path';

describe('transformCommand()', () => {
  test('should transform nodes', async () => {
    // Arrange
    const input = await fs.readJson(
      path.resolve(
        process.cwd(),
        'test/fixtures/magic-comments/2.split-line.json',
      ),
    );
    const output = await fs.readJson(
      path.resolve(
        process.cwd(),
        'test/fixtures/magic-comments/3.command.json',
      ),
    );

    // Act
    const next = transformCommand(input);

    // Assert
    expect(JSON.stringify(next)).toBe(JSON.stringify(output));
  });
});
