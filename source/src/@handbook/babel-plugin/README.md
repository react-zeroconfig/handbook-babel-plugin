# `@handbook/babel-plugin`

[![NPM](https://img.shields.io/npm/v/@handbook/babel-plugin.svg)](https://www.npmjs.com/package/@handbook/babel-plugin)
[![TEST](https://github.com/rocket-hangar/handbook/workflows/Test/badge.svg)](https://github.com/rocket-hangar/handbook/actions?query=workflow%3ATest)
[![codecov](https://codecov.io/gh/rocket-hangar/handbook/branch/master/graph/badge.svg)](https://codecov.io/gh/rocket-hangar/handbook)

## What does this do?

This is a babel plugin to transform all `source()` functions of `import { source } from @handbook/source`.

For example,

```ts
import { source } from '@handbook/source';

const { module: foo, source: fooSource1 } = source(require('./foo'));
const { module: fooImport, source: fooSource2 } = source(() => import('./foo'));
```

This babel plugin will transform the source into the below.

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

You can use this babel plugin when you need to make a development documentation web site.

<details><summary>See how to usage with a look at a test code.</summary>

<!-- source __tests__/*.test.ts -->

[\_\_tests\_\_/babel-plugin.test.ts](__tests__/babel-plugin.test.ts)

```ts
import { BabelFileResult, transform as babelTransform } from '@babel/core';
import { copyTmpDirectory } from '@ssen/tmp-directory';
import fs from 'fs';
import path from 'path';
import prettier from 'prettier';
import plugin from '../';

function format(code: string): string {
  return prettier.format(code, { parser: 'typescript' });
}

describe('@handbook/babel-plugin', () => {
  describe('file', () => {
    const output: string = `
      import { source } from "@handbook/source";
      source({
        module: "../../c/d/e",
        source: require("!!raw-loader!../../c/d/e").default,
        filename: "c/d/e.tsx",
      });
      source({
        module: "c/d/e",
        source: require("!!raw-loader!c/d/e").default,
        filename: "c/d/e.tsx",
      });
      source({
        module: require("../../c/d/e"),
        source: require("!!raw-loader!../../c/d/e").default,
        filename: "c/d/e.tsx",
      });
      source({
        module: require("c/d/e"),
        source: require("!!raw-loader!c/d/e").default,
        filename: "c/d/e.tsx",
      });
      source({
        module: () => import("../../c/d/e"),
        source: require("!!raw-loader!../../c/d/e").default,
        filename: "c/d/e.tsx",
      });
      source({
        module: () => import("c/d/e"),
        source: require("!!raw-loader!c/d/e").default,
        filename: "c/d/e.tsx",
      });
      source({
        module: "../../c/d/e.tsx",
        source: require("!!raw-loader!../../c/d/e.tsx").default,
        filename: "c/d/e.tsx",
      });
      source({
        module: "c/d/e.tsx",
        source: require("!!raw-loader!c/d/e.tsx").default,
        filename: "c/d/e.tsx",
      });
      source({
        module: require("../../c/d/e.tsx"),
        source: require("!!raw-loader!../../c/d/e.tsx").default,
        filename: "c/d/e.tsx",
      });
      source({
        module: require("c/d/e.tsx"),
        source: require("!!raw-loader!c/d/e.tsx").default,
        filename: "c/d/e.tsx",
      });
    `;

    test('should succeed to transform in src directory', async () => {
      // Arrange
      const cwd = await copyTmpDirectory(path.join(process.cwd(), `test/fixtures/src-project`));
      const file = 'a/b/c.tsx';
      const filename = path.join(cwd, 'src', file);
      const source: string = fs.readFileSync(filename, { encoding: 'utf8' });

      // Act
      const res: BabelFileResult | null = babelTransform(format(source), {
        babelrc: false,
        cwd,
        filename,
        plugins: [plugin, require.resolve('@babel/plugin-syntax-jsx')],
      });

      if (!res || !res.code) {
        throw new Error('plugin failed!');
      }

      // Assert
      expect(format(res.code)).toBe(format(output));
    });

    test('should succeed to transform in root directory', async () => {
      // Arrange
      const cwd = await copyTmpDirectory(path.join(process.cwd(), `test/fixtures/root-project`));
      const file = 'a/b/c.tsx';
      const filename = path.join(cwd, file);
      const source: string = fs.readFileSync(filename, { encoding: 'utf8' });

      // Act
      const res: BabelFileResult | null = babelTransform(format(source), {
        babelrc: false,
        cwd,
        filename,
        plugins: [plugin, require.resolve('@babel/plugin-syntax-jsx')],
      });

      if (!res || !res.code) {
        throw new Error('plugin failed!');
      }

      // Assert
      expect(format(res.code)).toBe(format(output));
    });
  });

  describe('source', () => {
    const filename = 'dir/test.tsx';

    function transform(code: string): string {
      const res: BabelFileResult | null = babelTransform(format(code), {
        babelrc: false,
        cwd: process.cwd(),
        filename: path.join(process.cwd(), 'src', filename).replace(/\\/g, '/'),
        plugins: [plugin, '@babel/plugin-syntax-jsx'],
      });

      if (!res || !res.code) {
        throw new Error('plugin failed!');
      }

      return res.code;
    }

    test('should fail to transform', () => {
      // Arrange
      const source = `
        import { source } from '@handbook/source';
        import { foo } from './foo';
        source(Math.random());
        source(foo());
      `;

      // Assert
      expect(format(transform(source))).toBe(format(source));
    });

    test('should succeed to transform', () => {
      // Arrange
      process.env.HANDBOOK_TEST_EXT = '.tsx';

      const module = './samples/Sample';

      const source = `
        import { source } from '@handbook/source';
        source(require('${module}'));
        source(() => import('${module}'));
      `;

      const moduleFilename = path.join(path.dirname(filename), module).replace(/\\/g, '/');

      const output = `
        import { source } from '@handbook/source';
        source({
          module: require('${module}'),
          source: require('!!raw-loader!${module}').default,
          filename: '${moduleFilename}.tsx',
        });
        source({
          module: () => import('${module}'),
          source: require('!!raw-loader!${module}').default,
          filename: '${moduleFilename}.tsx',
        });
      `;

      // Assert
      expect(format(transform(source))).toBe(format(output));
    });

    test('should succeed to transform in jsx', () => {
      // Arrange
      process.env.HANDBOOK_TEST_EXT = '.tsx';

      const module1 = './samples/Sample1';
      const module2 = './samples/Sample2';

      const source = `
        import { source } from '@handbook/source';
        import { Handbook, Preview, CodeBlock } from '@handbook/components';
        
        function App() {
          return (
            <div>
              <Handbook>
                {{
                  index: {
                    Title1: source(require('${module1}')),
                    Title2: source(() => import('${module2}')),
                  }
                }}
              </Handbook>
              
              <Preview source={source(require('${module1}'))}/>
              <Preview source={source(() => import('${module2}'))}/>
              
              <CodeBlock source={source(require('${module1}'))}/>
              <CodeBlock source={source(() => import('${module2}'))}/>
            </div>
          )
        }
      `;

      const moduleFilename1 = path.join(path.dirname(filename), module1).replace(/\\/g, '/');
      const moduleFilename2 = path.join(path.dirname(filename), module2).replace(/\\/g, '/');

      const output = `
        import { source } from '@handbook/source';
        import { Handbook, Preview, CodeBlock } from '@handbook/components';
        
        function App() {
          return (
            <div>
              <Handbook>
                {{
                  index: {
                    Title1: source({
                      module: require('${module1}'),
                      source: require('!!raw-loader!${module1}').default,
                      filename: '${moduleFilename1}.tsx',
                    }),
                    Title2: source({
                      module: () => import('${module2}'),
                      source: require('!!raw-loader!${module2}').default,
                      filename: '${moduleFilename2}.tsx',
                    }),
                  }
                }}
              </Handbook>
              
              <Preview source={source({
                module: require('${module1}'),
                source: require('!!raw-loader!${module1}').default,
                filename: '${moduleFilename1}.tsx',
              })}/>
              <Preview source={source({
                module: () => import('${module2}'),
                source: require('!!raw-loader!${module2}').default,
                filename: '${moduleFilename2}.tsx',
              })}/>
              
              <CodeBlock source={source({
                module: require('${module1}'),
                source: require('!!raw-loader!${module1}').default,
                filename: '${moduleFilename1}.tsx',
              })}/>
              <CodeBlock source={source({
                module: () => import('${module2}'),
                source: require('!!raw-loader!${module2}').default,
                filename: '${moduleFilename2}.tsx',
              })}/>
            </div>
          )
        }
      `;

      // Assert
      expect(format(transform(source))).toBe(format(output));
    });

    test('should succeed to transform namespace import', () => {
      // Arrange
      process.env.HANDBOOK_TEST_EXT = '.tsx';

      const module = './samples/Sample';

      const source = `
        import * as ns from '@handbook/source';
        ns.source(require('${module}'));
        ns.source(() => import('${module}'));
      `;

      const moduleFilename = path.join(path.dirname(filename), module).replace(/\\/g, '/');

      const output = `
        import * as ns from '@handbook/source';
        ns.source({
          module: require('${module}'),
          source: require('!!raw-loader!${module}').default,
          filename: '${moduleFilename}.tsx',
        });
        ns.source({
          module: () => import('${module}'),
          source: require('!!raw-loader!${module}').default,
          filename: '${moduleFilename}.tsx',
        });
      `;

      // Assert
      expect(format(transform(source))).toBe(format(output));
    });

    test('should succeed to transform default import', () => {
      // Arrange
      process.env.HANDBOOK_TEST_EXT = '.tsx';

      const module = './samples/Sample';

      const source = `
        import ns from '@handbook/source';
        ns.source(require('${module}'));
        ns.source(() => import('${module}'));
      `;

      const moduleFilename = path.join(path.dirname(filename), module).replace(/\\/g, '/');

      const output = `
        import ns from '@handbook/source';
        ns.source({
          module: require('${module}'),
          source: require('!!raw-loader!${module}').default,
          filename: '${moduleFilename}.tsx',
        });
        ns.source({
          module: () => import('${module}'),
          source: require('!!raw-loader!${module}').default,
          filename: '${moduleFilename}.tsx',
        });
      `;

      // Assert
      expect(format(transform(source))).toBe(format(output));
    });
  });
});
```

<!-- /source -->

</details>

## Install

Install packages.

```sh
npm install @handbook/babel-plugin @handbook/source --save-dev
```

Add plugin to your babel configuration.

```js
// your babel config
module.exports = {
  presets: [],
  plugins: [
    // TODO set transform plugin
    require.resolve('@handbook/babel-plugin'),
  ],
};
```

## See more

- [`@handbook/*`](https://github.com/rocket-hangar/handbook) This babel plugin is one of `@handbook/*` packages. Go to the project home and see more details.

## Related Projects

- <https://github.com/rocket-hangar/rocket-punch>
- <https://github.com/rocket-hangar/rocket-scripts>
- <https://github.com/rocket-hangar/generate-github-directory>
- <https://github.com/rocket-hangar/handbook>
