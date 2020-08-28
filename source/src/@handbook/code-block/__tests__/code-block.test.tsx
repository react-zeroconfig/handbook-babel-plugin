import { CodeBlock, MDXCodeBlock } from '@handbook/code-block';
import { render } from '@testing-library/react';
import prettier from 'prettier';
import * as React from 'react';

function format(code: string): string {
  return prettier.format(code, { parser: 'typescript' });
}

const source = format(`
interface Test {
  s: string;
  a: number;
  b: number;
}
`);

describe('@handbook/code-block', () => {
  test('should render <MDXCodeBlock>', async () => {
    // Arrange
    const { container } = render(<MDXCodeBlock className="language-typescript" children={source} />);

    // Assert
    expect(container.querySelector('.token.keyword')?.textContent).toBe('interface');
    expect(container.querySelector('.token.class-name')?.textContent).toBe('Test');
    expect(format(container.textContent ?? '')).toBe(source);
    expect(container.innerHTML).toMatchSnapshot();
  });

  test('should render <CodeBlock>', async () => {
    // Arrange
    const { container } = render(<CodeBlock language="typescript" children={source} />);

    // Assert
    expect(container.querySelector('.token.keyword')?.textContent).toBe('interface');
    expect(container.querySelector('.token.class-name')?.textContent).toBe('Test');
    expect(format(container.textContent ?? '')).toBe(source);
    expect(container.innerHTML).toMatchSnapshot();
  });
});
