import { Language, PrismTheme } from 'prism-react-renderer';
import React from 'react';
import { MDXCodeBlock } from './MDXCodeBlock';

export interface CodeBlockProps {
  /**
   * your code block theme
   *
   * you can choose one of dracula, duotoneDark, duotoneLight, github, nightOwl, nightOwlLight, oceanicNext, palenight, shadesOfPurple, synthwave84, ultramin and vsDark
   *
   * @example import github from 'prism-react-renderer/themes/github'
   *
   * @see <rootDir>/node_modules/prism-react-renderer/themes
   */
  theme?: PrismTheme;

  /** source code */
  children: string;

  /** language */
  language: Language;
}

export function CodeBlock({ children, language, theme }: CodeBlockProps) {
  return (
    <MDXCodeBlock className={`language-${language}`} theme={theme}>
      {children}
    </MDXCodeBlock>
  );
}
