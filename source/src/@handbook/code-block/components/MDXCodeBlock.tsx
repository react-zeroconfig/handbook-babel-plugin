import { mdx } from '@mdx-js/react';
import Highlight, { defaultProps, Language, PrismTheme } from 'prism-react-renderer';
import vsDark from 'prism-react-renderer/themes/vsDark';
import React from 'react';
import { LiveEditor, LiveError, LivePreview, LiveProvider } from 'react-live';

export interface MDXCodeBlockProps {
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

  /** source string */
  children: string;

  /** css className */
  className?: string;

  /** react-live options */
  live?: boolean;
  render?: boolean;
}

export function MDXCodeBlock({
  theme = vsDark,
  children,
  className,
  live = false,
  render = false,
}: MDXCodeBlockProps) {
  const language = className?.replace(/language-/, '') as Language;

  if (live) {
    return (
      <div style={{ marginTop: '2em', backgroundColor: 'black' }}>
        <LiveProvider
          code={children.trim()}
          transformCode={(code) => '/** @jsx mdx */' + code}
          scope={{ mdx }}
        >
          <LivePreview />
          <LiveEditor />
          <LiveError />
        </LiveProvider>
      </div>
    );
  }

  if (render) {
    return (
      <div style={{ marginTop: '2em' }}>
        <LiveProvider code={children}>
          <LivePreview />
        </LiveProvider>
      </div>
    );
  }

  return (
    <Highlight {...defaultProps} code={children.trim()} language={language} theme={theme}>
      {({ className: cls, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={cls} style={{ ...style, padding: '1em' }}>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}
