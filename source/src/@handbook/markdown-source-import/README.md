# `@handbook/markdown-source-import`

[![NPM](https://img.shields.io/npm/v/@handbook/markdown-source-import.svg)](https://www.npmjs.com/package/@handbook/markdown-source-import)
[![TEST](https://github.com/rocket-hangar/handbook/workflows/Test/badge.svg)](https://github.com/rocket-hangar/handbook/actions?query=workflow%3ATest)
[![codecov](https://codecov.io/gh/rocket-hangar/handbook/branch/master/graph/badge.svg)](https://codecov.io/gh/rocket-hangar/handbook)

## What does this do?

This tool gives two markdown comments.

For example,

```md
# Source

<!-- source file.ts -->
<!-- /source -->

# List

<!-- index packages/**/*.md -->
<!-- /index -->
```

This tool will transform the markdown document into the below.

````md
# Source

<!-- source file.ts -->

```ts
// file.ts
console.log("hello world");
```

<!-- /source -->

# List

<!-- index packages/**/*.md -->

- [packages/package1/README.md](packages/package1/README.md)
- [packages/package2/README.md](packages/package2/README.md)
- [packages/package3/README.md](packages/package3/README.md)

<!-- /index -->
````

## Usage

Install

```sh
npm install @handbook/markdown-source-import --save-dev
```

Add a script to `package.json`

```json
{
  "scripts": {
    "source-import": "markdown-source-import README.md src/**/*.md"
  }
}
```

And if you use husky or the other pre-commit hook.

```json
{
  "husky": {
    "pre-commit": "markdown-source-import README.md src/**/*.md --git-add"
  }
}
```

## Magic Comments

```md
# Import Source

## Single file

<!-- source file.ts -->
<!-- /source -->

## Multiple files

<!-- source file1.ts file2.ts file3.ts -->
<!-- /source -->

## Glob

<!-- source tests/*.ts -->
<!-- /source -->

## `--pick` (only support js, jsx, ts, tsx)

<!-- source file.ts --pick "someFunction SomeType SomeClass" -->
<!-- /source -->

# Create Index

<!-- index src/**/*.md -->
<!-- /index -->
```

## See more

- [`@handbook/*`](https://github.com/rocket-hangar/handbook) This package is one of `@handbook/*` packages. Go to the project home and see more details.

## Related Projects

- <https://github.com/rocket-hangar/rocket-punch>
- <https://github.com/rocket-hangar/rocket-scripts>
- <https://github.com/rocket-hangar/generate-github-directory>
- <https://github.com/rocket-hangar/handbook>
