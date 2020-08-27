# Handbook.js

## `@handbook/babel-plugin`

Babel plugin will transform your source codes.

```js
module.exports = {
  presets: [
    [
      require.resolve('@rocket-scripts/react-preset/babelPreset'),
      {
        modules: false,
        targets: getBrowserslistQuery({ cwd: process.cwd() }),
      },
    ],
  ],
  plugins: [
    // TODO set transform plugin
    require.resolve('@handbook/babel-plugin'),
  ],  
}
```

## `@handbook/source`

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
  module: require('./a/source.ts'),
  source: require('!!raw-loader!./a/source.ts'),
  filename: 'a/source.ts'
});
source({
  module: () => import('./source.ts'),
  source: require('!!raw-loader!./a/source.ts'),
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