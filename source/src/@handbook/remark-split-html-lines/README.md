# `@handbook/remark-split-html-lines`

[![NPM](https://img.shields.io/npm/v/@handbook/remark-split-html-lines.svg)](https://www.npmjs.com/package/@handbook/remark-split-html-lines)
[![TEST](https://github.com/rocket-hangar/handbook/workflows/Test/badge.svg)](https://github.com/rocket-hangar/handbook/actions?query=workflow%3ATest)
[![codecov](https://codecov.io/gh/rocket-hangar/handbook/branch/master/graph/badge.svg)](https://codecov.io/gh/rocket-hangar/handbook)

## How to usage

```ts
import unified from "unified";

export const processor = unified()
  .use(require("remark-parse"))
  .use(require("@handbook/remark-split-html-lines"))
  .use(require("@handbook/remark-magic-comments"))
  .use(require("remark-stringify"), {
    listItemIndent: 1,
  });
```

## What does this do?

When you have an AST tree like below.

```json
[
  {
    "type": "html",
    "value": "<details>\n<summary>Detail</summary>\n\n<!-- source test.ts -->"
  }
]
```

It converted to like below.

```json
[
  {
    "type": "html",
    "value": "<details>"
  },
  {
    "type": "html",
    "value": "<summary>Detail</summary>"
  },
  {
    "type": "html",
    "value": ""
  },
  {
    "type": "html",
    "value": "<!-- source test.ts -->"
  }
]
```

## See more

- [`@handbook/*`](https://github.com/rocket-hangar/handbook) This package is one of `@handbook/*` packages. Go to the project home and see more details.

## Related Projects

- <https://github.com/rocket-hangar/rocket-punch>
- <https://github.com/rocket-hangar/rocket-scripts>
- <https://github.com/rocket-hangar/generate-github-directory>
- <https://github.com/rocket-hangar/handbook>
