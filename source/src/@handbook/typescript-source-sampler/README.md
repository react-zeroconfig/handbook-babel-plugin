# `@handbook/typescript-source-sampler`

[![NPM](https://img.shields.io/npm/v/@handbook/typescript-source-sampler.svg)](https://www.npmjs.com/package/@handbook/typescript-source-sampler)
[![TEST](https://github.com/rocket-hangar/handbook/workflows/Test/badge.svg)](https://github.com/rocket-hangar/handbook/actions?query=workflow%3ATest)
[![codecov](https://codecov.io/gh/rocket-hangar/handbook/branch/master/graph/badge.svg)](https://codecov.io/gh/rocket-hangar/handbook)

## What does this do?

You can pickup items on your typescript source code.

When you have a code like below.

```ts
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
    console.log("constructor");
  }

  foo = () => {};

  bar() {}
}

/**
 * function
 */
export function hello() {
  return "Hello World!";
}
```

You can get `Class` code only

```js
import { source } from "@handbook/source";
import { sampling } from "@handbook/typescript-source-sampler";

const module = source(require("./source/hello"));
const samples = sampling({ source: module.source, samples: ["Class"] });

console.log(samples.get("Class"));
```

It will print without body statements.

```ts
/**
 * class
 */
export class Class {}
```

## API

<!-- source index.ts --pick "SamplingParams sampling" -->

[index.ts](index.ts)

```ts
/**
 * pick source codes
 *
 * @return Map<sample name, source code>
 */
export function sampling<S extends string>({
  source,
  samples,
}: SamplingParams<S>): Map<S, string> {}

export interface SamplingParams<S extends string> {
  /** typescript source code */
  source: string;
  /**
   * item names
   *
   * `Name` of `export interface Name {}`
   *
   * Please note that the names must be `export` items
   */
  samples: S[];
}
```

<!-- /source -->

## When you use to Web App

Note that if you use Webpack to Web App, `typescript` makes a problem to you Webpack building. `typescript` has a considerable size, making it slower to build performance.

Please add `typescript` to `externals` of your Webpack configuration.

```js
// your webpack.config.js
module.exports = {
  externals: {
    typescript: "ts",
  },
};
```

And use CDN version `typescript`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/typescript/4.0.2/typescript.min.js"></script>
  </head>

  <body></body>
</html>
```

## See more

- [`@handbook/*`](https://github.com/rocket-hangar/handbook) This package is one of `@handbook/*` packages. Go to the project home and see more details.
