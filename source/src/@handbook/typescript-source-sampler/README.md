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

<details><summary>See how to usage with a look at a test code.</summary>

<!-- source __tests__/*.test.ts -->

[\_\_tests\_\_/sampling.test.ts](__tests__/sampling.test.ts)

```ts
import { sampling } from "@handbook/typescript-source-sampler";
import prettier from "prettier";

const source: string = `
/**
 * Foo....
 */
export interface X {
  a: string;
  b: number;
}

export interface Y {
  /** foo... */
  a: string;
  
  /** bar... */
  b: number;
}

interface Z {
}

/**
 * hello?
 */
export function x({ a, b }: { a: number, b: number }): number {
  console.log('hello world?');
  return a + b;
}

export function y() {
  console.log('hello world?');
}

/**
 * ????
 */
export const q = () => () => {
  console.log('xxx');
}

/**
 * hello?
 */
function z() {
  console.log('hello world?');
}

/** skjsksjk */
export const xx: string = 'aaaa';

export const yy: number = 12323;

const zz: string = 'sss';

/** kkdkdjdk */
export const nodes = <div>Hello?</div>;

/** fldjkjek */
export class Test {
  constructor(hello: string) {
  }
  
  function x(): string {
    return 'x';
  }
  
  y = () => {
    return 'y';
  }
}
`;

function format(source: string): string {
  return prettier.format(source, { parser: "typescript" });
}

describe("@handbook/typescript-source-sampler", () => {
  test("should get the interface sample", () => {
    // Act
    const result = sampling({ samples: ["X"], source });

    // Assert
    expect(format(result.get("X") ?? "")).toBe(
      format(`
      /**
       * Foo....
       */
      export interface X {
        a: string;
        b: number;
      }
      `)
    );
  });

  test("should get the class sample", () => {
    // Act
    const result = sampling({ samples: ["Test"], source });

    // Assert
    expect(format(result.get("Test") ?? "")).toBe(
      format(`
      /** fldjkjek */
      export class Test {}
      `)
    );
  });

  test("should get the function sample", () => {
    // Act
    const result = sampling({ samples: ["x"], source });

    // Assert
    expect(format(result.get("x") ?? "")).toBe(
      format(`
      /**
       * hello?
       */
      export function x({ a, b }: { a: number, b: number }): number {};
      `)
    );
  });

  test("should get the variable sample", () => {
    // Act
    const result = sampling({ samples: ["xx"], source });

    // Assert
    expect(format(result.get("xx") ?? "")).toBe(
      format(`
      /** skjsksjk */
      export const xx: string = 'aaaa';
      `)
    );
  });

  test("should get arrow function", () => {
    // Act
    const result = sampling({ samples: ["q"], source });

    // Assert
    expect(format(result.get("q") ?? "")).toBe(
      format(`
      /**
       * ????
       */
      export const q = () => () => {}
      `)
    );
  });
});
```

<!-- /source -->

</details>

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

## Related Projects

- <https://github.com/rocket-hangar/rocket-punch>
- <https://github.com/rocket-hangar/rocket-scripts>
- <https://github.com/rocket-hangar/generate-github-directory>
- <https://github.com/rocket-hangar/handbook>
