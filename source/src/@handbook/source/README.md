# `@handbook/source`

[![NPM](https://img.shields.io/npm/v/@handbook/source.svg)](https://www.npmjs.com/package/@handbook/source)
[![TEST](https://github.com/rocket-hangar/handbook/workflows/Test/badge.svg)](https://github.com/rocket-hangar/handbook/actions?query=workflow%3ATest)
[![codecov](https://codecov.io/gh/rocket-hangar/handbook/branch/master/graph/badge.svg)](https://codecov.io/gh/rocket-hangar/handbook)

## What is this?

You can use this when you need to import a module with its source code together.

For example,

```ts
import { source } from '@handbook/source';

const { module: foo, source: fooSource1 } = source(require('./foo'));
const { module: fooImport, source: fooSource2 } = source(() => import('./foo'));
```

The `source()` function will transform the source into the below.

```ts
import { source } from '@handbook/source';

const { module: foo, source: fooSource1 } = source({
  module: require('./foo'),
  source: require('!!raw-loader!./foo'),
  filename: 'foo.ts',
});
const { module: fooImport, source: fooSource2 } = source({
  module: () => import('./foo'),
  source: require('!!raw-loader!./foo'),
  filename: 'foo.ts',
});
```

⚠️ `source()` function is just an identifier. You have to set [`@handbook/babel-plugin`](https://www.npmjs.com/package/@handbook/babel-plugin) on your babel configuration.

## See more

- [`@handbook/*`](https://github.com/rocket-hangar/handbook) This package is one of `@handbook/*` packages. Go to the project home and see more details.

## Related Projects

- <https://github.com/rocket-hangar/rocket-punch>
- <https://github.com/rocket-hangar/rocket-scripts>
- <https://github.com/rocket-hangar/generate-github-directory>
- <https://github.com/rocket-hangar/handbook>
