# Handbook.js

[![NPM](https://img.shields.io/npm/v/@handbook/babel-plugin.svg)](https://www.npmjs.com/package/@handbook/babel-plugin)
[![NPM](https://img.shields.io/npm/v/@handbook/source.svg)](https://www.npmjs.com/package/@handbook/source)
[![NPM](https://img.shields.io/npm/v/@handbook/typescript-source-sampler.svg)](https://www.npmjs.com/package/@handbook/typescript-source-sampler)
[![TEST](https://github.com/rocket-hangar/handbook/workflows/Test/badge.svg)](https://github.com/rocket-hangar/handbook/actions?query=workflow%3ATest)
[![codecov](https://codecov.io/gh/rocket-hangar/handbook/branch/master/graph/badge.svg)](https://codecov.io/gh/rocket-hangar/handbook)

Development documentation toolset. (example: <https://rocket-handbook-example.netlify.app/>)

## `@handbook/babel-plugin`

Babel plugin will transform your source codes.

```js
module.exports = {
  // your babel config
  presets: [
    require.resolve('@rocket-scripts/react-preset/babelPreset'),
  ],
  plugins: [
    // TODO set transform plugin
    require.resolve('@handbook/babel-plugin'),
  ],  
}
```

## `@handbook/source` 

(`@handbook/babel-plugin` required)

This code

```js
import { source } from '@handbook/source';

source(require('./a/source'));
source(() => import('./a/source'));
```

Will transform to like this

```js
import { source } from '@handbook/source';

source({
  module: require('./a/source'),
  source: require('!!raw-loader!./a/source'),
  filename: 'a/source.ts'
});
source({
  module: () => import('./source'),
  source: require('!!raw-loader!./a/source'),
  filename: 'a/source.ts'
});
```

## `@handbook/typescript-source-transform`

You can sample your typescript source code.

When you have a code like below

```ts
// hello.ts

/**
 * type
 */
export interface Type {
  /** a */
  a: string;
  /** b */
  b: number;
}

/**
 * class
 */
export class Class {
  constructor() {
    console.log('constructor');
  }

  foo = () => {};

  bar() {}
}

/**
 * function
 */
export function hello() {
  return 'Hello World!';
}
```

You can get `Class` code only

```js
import { source } from '@handbook/source';
import { sampling } from '@handbook/typescript-source-sampler';

const module = source(require('./source/hello'));
const samples = sampling({ source: module.source, samples: ['Class'] });

console.log(samples.get('Class'));
```

It will print without body statements

```ts
/**
 * class
 */
export class Class {
}
```

## `@handbook/code-block`

Simple use

```jsx
import { CodeBlock } from '@handbook/code-block';

function Component(sourceCode: string) {
  return (
    <CodeBlock language="js">{sourceCode}</CodeBlock>
  )
}
```

Set default code block of mdx documents

```jsx
import { MDXCodeBlock } from '@handbook/code-block';

const components = {
  pre: props => <div {...props} />,
  code: MDXCodeBlock,
};

export function App() {
  return (
    <MDXProvider components={components}>
      <Content/>
    </MDXProvider>
  );
}
```

## `@handbook/markdown-source-import`

Transform markdown with magic comments

```md
# Title

## Sources

<!-- source src/**/types.js -->
<!-- /source -->

## Indexes

<!-- index src/**/*.md -->
<!-- /index -->
```

```sh
npx markdown-source-import doc.md
```

```json
{
  "husky": {
    "pre-commit": "markdown-source-import src/**/*.md --git-add && lint-staged"
  }
}
```


# Related Projects

- <https://github.com/rocket-hangar/rocket-punch>
- <https://github.com/rocket-hangar/rocket-scripts>
- <https://github.com/rocket-hangar/handbook>
- <https://github.com/rocket-hangar/generate-github-directory>