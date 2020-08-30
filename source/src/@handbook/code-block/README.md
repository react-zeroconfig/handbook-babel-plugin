# `@handbook/code-block`

[![NPM](https://img.shields.io/npm/v/@handbook/code-block.svg)](https://www.npmjs.com/package/@handbook/code-block)
[![TEST](https://github.com/rocket-hangar/handbook/workflows/Test/badge.svg)](https://github.com/rocket-hangar/handbook/actions?query=workflow%3ATest)
[![codecov](https://codecov.io/gh/rocket-hangar/handbook/branch/master/graph/badge.svg)](https://codecov.io/gh/rocket-hangar/handbook)

## CodeBlock React components

<a href="https://rocket-handbook-example.netlify.app" target="_blank">

  <img src="https://raw.githubusercontent.com/rocket-hangar/handbook/master/doc-assets/code-block.png" width="800" style="max-width: 800px" />

</a>

Use React component.

```jsx
import { CodeBlock } from "@handbook/code-block";

function Component(sourceCode: string) {
  return <CodeBlock language="js">{sourceCode}</CodeBlock>;
}
```

Set default code block for mdx documents.

```jsx
import { MDXCodeBlock } from "@handbook/code-block";

const components = {
  pre: (props) => <div {...props} />,
  code: MDXCodeBlock,
};
```

## API

<!-- source components/CodeBlock.tsx --pick "CodeBlockProps CodeBlock" -->

[components/CodeBlock.tsx](components/CodeBlock.tsx)

```tsx
export function CodeBlock({ children, language, theme }: CodeBlockProps) {}

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
```

<!-- /source -->

<!-- source components/MDXCodeBlock.tsx --pick "MDXCodeBlockProps MDXCodeBlock" -->

[components/MDXCodeBlock.tsx](components/MDXCodeBlock.tsx)

```tsx
export function MDXCodeBlock({
  theme = vsDark,
  children,
  className = "language-javascript",
}: MDXCodeBlockProps) {}

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
}
```

<!-- /source -->

## How to get source codes

These code block components print source codes only.

If you want to get source codes into your Web App use [`@handbook/source`](https://www.npmjs.com/package/@handbook/source), [`@handbook/babel-plugin`](https://www.npmjs.com/package/@handbook/babel-plugin) and [`@handbook/typescript-source-sampler`](https://www.npmjs.com/package/@handbook/typescript-source-sampler).

You can print your source code on your Web App easier.

```tsx
import React from "react";
import { render } from "react-dom";
import { source } from "@handbook/source";
import { sampling } from "@handbook/typescript-source-sampler";
import { CodeBlock } from "@handbook/code-block";

const module = source(require("./source/hello"));
const samples = sampling({ source: module.source, samples: ["Class", "func"] });

function App() {
  return <CodeBlock language="typescript" children={samples.get("Class")} />;
}

render(<App />, document.querySelector("#app"));
```

## See more

- [`@handbook/*`](https://github.com/rocket-hangar/handbook) This package is one of `@handbook/*` packages. Go to the project home and see more details.
