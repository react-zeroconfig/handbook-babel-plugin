import { processCommand } from '@handbook/remark-magic-comments/processCommand';
import fs from 'fs-extra';
import path from 'path';

describe('processCommand()', () => {
  test('should process nodes', async () => {
    // Arrange
    const dirname = path.resolve(process.cwd(), 'test/fixtures/magic-comments');
    const input = await fs.readJson(path.resolve(dirname, '3.command.json'));
    const output = await fs.readJson(path.resolve(dirname, '4.process.json'));

    // Act
    const next = await processCommand(input, dirname);

    // Assert
    expect(JSON.stringify(next)).toBe(JSON.stringify(output));
  });
});
