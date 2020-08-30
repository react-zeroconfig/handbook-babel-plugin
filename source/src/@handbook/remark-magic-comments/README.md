# `@handbook/remark-magic-comments`

[![NPM](https://img.shields.io/npm/v/@handbook/remark-magic-comments.svg)](https://www.npmjs.com/package/@handbook/remark-magic-comments)
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
    "value": "<!-- source test.ts -->"
  },
  {
    "type": "html",
    "value": "<!-- /source -->"
  }
]
```

It converted to like below.

```json
[
  {
    "type": "html",
    "value": "<!-- source test.ts -->",
    "command": "source",
    "phase": "start",
    "filePatterns": ["source/typescript.ts"]
  },
  {
    "type": "paragraph",
    "children": [
      {
        "type": "link",
        "title": null,
        "url": "source/test.ts",
        "children": [
          {
            "type": "text",
            "value": "source/test.ts"
          }
        ]
      }
    ]
  },
  {
    "type": "code",
    "lang": "ts",
    "meta": null,
    "value": "/**\n * interface\n */\nexport interface Interface {\n    /** a */\n    a: string;\n    /** b */\n    b: number;\n}\n\n/**\n * class\n */\nexport class Class {\n}\n\n/**\n * currying\n */\nexport const currying = (a: number) => (b: number): number => { };"
  },
  {
    "type": "html",
    "value": "<!-- /source -->",
    "command": "source",
    "phase": "end"
  }
]
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
