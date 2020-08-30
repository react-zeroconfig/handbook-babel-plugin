# Handbook.js

[![TEST](https://github.com/rocket-hangar/handbook/workflows/Test/badge.svg)](https://github.com/rocket-hangar/handbook/actions?query=workflow%3ATest)
[![codecov](https://codecov.io/gh/rocket-hangar/handbook/branch/master/graph/badge.svg)](https://codecov.io/gh/rocket-hangar/handbook)

Main Front-Ends are two.

- Transform the comments (e.g. `<!-- source file.ts -->`, `<!-- index src/**/*.md -->`) of your Markdown documents (`*.md`) with CLI command and at git pre-commit.
  - [`@handbook/markdown-source-import`](source/src/@handbook/markdown-source-import) CLI Interface.
    - [`@handbook/remark-node-types`](source/src/@handbook/remark-node-types)
    - [`@handbook/remark-magic-comments`](source/src/@handbook/remark-magic-comments)
    - [`@handbook/remark-split-html-lines`](source/src/@handbook/remark-split-html-lines)
- Import Source Codes to your Web App. (e.g. `const { module, source, filename } = source(require('./module'))`)
  - [Example Project](example)
  - [`@handbook/source`](source/src/@handbook/source) Main function
    - [`@handbook/babel-plugin`](source/src/@handbook/babel-plugin) Babel transformer plugin
  - [`@handbook/typescript-source-sampler`](source/src/@handbook/typescript-source-sampler) TypeScript Source Picker
  - [`@handbook/code-block`](source/src/@handbook/code-block) Code Block React Components

## Packages

<!-- index source/src/**/README.md -->

- [source/src/@handbook/babel-plugin/README.md](source/src/@handbook/babel-plugin/README.md)
- [source/src/@handbook/code-block/README.md](source/src/@handbook/code-block/README.md)
- [source/src/@handbook/markdown-source-import/README.md](source/src/@handbook/markdown-source-import/README.md)
- [source/src/@handbook/remark-magic-comments/README.md](source/src/@handbook/remark-magic-comments/README.md)
- [source/src/@handbook/remark-node-types/README.md](source/src/@handbook/remark-node-types/README.md)
- [source/src/@handbook/remark-split-html-lines/README.md](source/src/@handbook/remark-split-html-lines/README.md)
- [source/src/@handbook/source/README.md](source/src/@handbook/source/README.md)
- [source/src/@handbook/typescript-source-sampler/README.md](source/src/@handbook/typescript-source-sampler/README.md)

<!-- /index -->

## Related Projects

- <https://github.com/rocket-hangar/rocket-punch>
- <https://github.com/rocket-hangar/rocket-scripts>
- <https://github.com/rocket-hangar/generate-github-directory>
- <https://github.com/rocket-hangar/handbook>
