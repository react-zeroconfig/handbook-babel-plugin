import { resolveCommandNode } from '@handbook/remark-magic-comments/nodes';

describe('nodes', () => {
  describe('source', () => {
    test.each([
      '<!-- source test.tsx -->',
      '<!--source test.tsx-->',
      '<!--      source test.tsx        -->',
      '<!-- source test.tsx -->  ',
      '<!--source test.tsx-->  ',
      '<!--      source test.tsx        -->  ',
    ])('should parse start (%s)', (comment: string) => {
      // Arrange
      const node = { type: 'html', value: comment };

      // Assert
      expect(resolveCommandNode(node)).toMatchObject({
        ...node,
        command: 'source',
        phase: 'start',
        filePatterns: ['test.tsx'],
      });
    });

    test.each([
      '<!-- source test.tsx test2.ts -->',
      '<!--source test.tsx test2.ts-->',
      '<!--      source test.tsx test2.ts   -->',
      '<!-- source test.tsx test2.ts -->  ',
      '<!--source test.tsx test2.ts-->  ',
      '<!--      source test.tsx test2.ts   -->  ',
    ])('should parse multiple patterns (%s)', (comment: string) => {
      // Arrange
      const node = { type: 'html', value: comment };

      // Assert
      expect(resolveCommandNode(node)).toMatchObject({
        ...node,
        command: 'source',
        phase: 'start',
        filePatterns: ['test.tsx', 'test2.ts'],
      });
    });

    test.each([
      '<!-- source test.tsx test2.ts --pick "A B C D" -->',
      '<!--source test.tsx test2.ts --pick "A B C D"-->',
      '<!--      source test.tsx test2.ts --pick "A B C D"   -->',
      '<!-- source test.tsx test2.ts --pick "A B C D" -->  ',
      '<!--source test.tsx test2.ts --pick "A B C D"-->  ',
      '<!--      source test.tsx test2.ts --pick "A B C D"   -->  ',
    ])('should parse options (%s)', (comment: string) => {
      // Arrange
      const node = { type: 'html', value: comment };

      // Assert
      expect(resolveCommandNode(node)).toMatchObject({
        ...node,
        command: 'source',
        phase: 'start',
        filePatterns: ['test.tsx', 'test2.ts'],
        pick: ['A', 'B', 'C', 'D'],
      });
    });

    test.each([
      '<!-- source **/*.{js,jsx,ts,tsx} -->',
      '<!--source **/*.{js,jsx,ts,tsx}-->',
      '<!--      source **/*.{js,jsx,ts,tsx}   -->',
      '<!-- source **/*.{js,jsx,ts,tsx} -->  ',
      '<!--source **/*.{js,jsx,ts,tsx}-->  ',
      '<!--      source **/*.{js,jsx,ts,tsx}   -->  ',
    ])('should parse glob patterns (%s)', (comment: string) => {
      // Arrange
      const node = { type: 'html', value: comment };

      // Assert
      expect(resolveCommandNode(node)).toMatchObject({
        ...node,
        command: 'source',
        phase: 'start',
        filePatterns: ['**/*.{js,jsx,ts,tsx}'],
      });
    });
  });

  describe('index', () => {
    test.each([
      '<!-- index test.md -->',
      '<!--index test.md-->',
      '<!--      index test.md        -->',
      '<!-- index test.md -->  ',
      '<!--index test.md-->  ',
      '<!--      index test.md        -->  ',
    ])('should parse start (%s)', (comment: string) => {
      // Arrange
      const node = { type: 'html', value: comment };

      // Assert
      expect(resolveCommandNode(node)).toMatchObject({
        ...node,
        command: 'index',
        phase: 'start',
        filePatterns: ['test.md'],
      });
    });

    test.each([
      '<!-- index test.md test2.md -->',
      '<!--index test.md test2.md-->',
      '<!--      index test.md test2.md   -->',
      '<!-- index test.md test2.md -->  ',
      '<!--index test.md test2.md-->  ',
      '<!--      index test.md test2.md   -->  ',
    ])('should parse multiple patterns (%s)', (comment: string) => {
      // Arrange
      const node = { type: 'html', value: comment };

      // Assert
      expect(resolveCommandNode(node)).toMatchObject({
        ...node,
        command: 'index',
        phase: 'start',
        filePatterns: ['test.md', 'test2.md'],
      });
    });

    test.each([
      '<!-- index **/*.md -->',
      '<!--index **/*.md-->',
      '<!--      index **/*.md   -->',
      '<!-- index **/*.md -->  ',
      '<!--index **/*.md-->  ',
      '<!--      index **/*.md   -->  ',
    ])('should parse glob patterns (%s)', (comment: string) => {
      // Arrange
      const node = { type: 'html', value: comment };

      // Assert
      expect(resolveCommandNode(node)).toMatchObject({
        ...node,
        command: 'index',
        phase: 'start',
        filePatterns: ['**/*.md'],
      });
    });
  });

  test.each([
    '<!-- /source -->',
    '<!--/source-->',
    '<!--      /source        -->',
    '<!-- /source -->  ',
    '<!--/source-->  ',
    '<!--      /source        -->  ',
  ])('should parse source end (%s)', (comment: string) => {
    // Arrange
    const node = { type: 'html', value: comment };

    // Assert
    expect(resolveCommandNode(node)).toMatchObject({
      ...node,
      command: 'source',
      phase: 'end',
    });
  });

  test.each([
    '<!-- /index -->',
    '<!--/index-->',
    '<!--      /index        -->',
    '<!-- /index -->  ',
    '<!--/index-->  ',
    '<!--      /index        -->  ',
  ])('should parse index end (%s)', (comment: string) => {
    // Arrange
    const node = { type: 'html', value: comment };

    // Assert
    expect(resolveCommandNode(node)).toMatchObject({
      ...node,
      command: 'index',
      phase: 'end',
    });
  });
});
