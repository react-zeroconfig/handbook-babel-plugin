import { NodePath, Visitor } from '@babel/traverse';
import * as types from '@babel/types';
import { existsSync } from 'fs';
import { dirname, join, relative } from 'path';

const CORE = '@handbook/core';

interface Babel {
  types: typeof types;
}

interface BabelPlugin {
  visitor: Visitor<{
    opts?: {
      target?: string;
      runtime?: string;
    };
    file: {
      path: NodePath;
    };
  }>;
}

interface Opts {
  cwd: string;
  filename: string;
}

function getExtension(loc: string, ...extensions: string[]): string | undefined {
  if (process.env.JEST_WORKER_ID) return extensions[0];
  return extensions.find(ext => existsSync(loc + ext));
}

export function transformPageCall(t: typeof types, path: NodePath<types.CallExpression>, opts: Opts) {
  if (path.node.arguments.length > 1 || !t.isStringLiteral(path.node.arguments[0])) return;

  const importName: string = path.node.arguments[0].value;
  const absoulteFileLocation: string = join(dirname(opts.filename), path.node.arguments[0].value);
  const ext: string | undefined = getExtension(absoulteFileLocation, '.mdx');

  if (!ext) return;

  path.node.arguments.push(
    t.objectExpression([
      t.objectProperty(
        t.identifier('component'),
        t.arrowFunctionExpression([], t.callExpression(t.identifier('import'), [t.stringLiteral(importName)])),
      ),
      t.objectProperty(t.identifier('filename'), t.stringLiteral(relative(opts.cwd, absoulteFileLocation) + ext)),
    ]),
  );
}

export function transformPreviewCall(t: typeof types, path: NodePath<types.CallExpression>, opts: Opts) {
  if (path.node.arguments.length > 1 || !t.isStringLiteral(path.node.arguments[0])) return;

  const importName: string = path.node.arguments[0].value;
  const absoulteFileLocation: string = join(dirname(opts.filename), path.node.arguments[0].value);
  const ext: string | undefined = getExtension(absoulteFileLocation, '.tsx', '.jsx', '.js', '.ts', '.mjs');

  if (!ext) return;

  path.node.arguments.push(
    t.objectExpression([
      t.objectProperty(
        t.identifier('component'),
        t.callExpression(t.identifier('require'), [t.stringLiteral(importName)]),
      ),
      t.objectProperty(
        t.identifier('source'),
        t.callExpression(t.identifier('require'), [t.stringLiteral(`!!raw-loader!${importName}`)]),
      ),
      t.objectProperty(t.identifier('filename'), t.stringLiteral(relative(opts.cwd, absoulteFileLocation) + ext)),
    ]),
  );
}

export default function({ types: t }: Babel): BabelPlugin {
  let opts: Opts | null = null;
  let handbook: string | null = null;
  let page: string | null = null;
  let preview: string | null = null;

  return {
    visitor: {
      Program(path: NodePath<types.Program>) {
        opts = path.hub.file.opts;
        handbook = null;
        page = null;
        preview = null;
      },

      ImportDeclaration(path: NodePath<types.ImportDeclaration>) {
        if (path.node.source.value !== CORE) return;

        for (const specifier of path.node.specifiers) {
          if (t.isImportNamespaceSpecifier(specifier)) {
            handbook = specifier.local.name;
          } else if (t.isImportDefaultSpecifier(specifier)) {
            handbook = specifier.local.name;
          } else if (t.isImportSpecifier(specifier)) {
            switch (specifier.imported.name) {
              case 'page':
                page = specifier.local.name;
                break;
              case 'preview':
                preview = specifier.local.name;
                break;
            }
          }
        }
      },
      CallExpression(path: NodePath<types.CallExpression>) {
        if (!opts) return;

        if (page && t.isIdentifier(path.node.callee, { name: page })) {
          transformPageCall(t, path, opts);
        } else if (preview && t.isIdentifier(path.node.callee, { name: preview })) {
          transformPreviewCall(t, path, opts);
        } else if (
          handbook &&
          'object' in path.node.callee &&
          'property' in path.node.callee &&
          t.isIdentifier(path.node.callee.object, { name: handbook }) &&
          t.isIdentifier(path.node.callee.property, { name: 'page' })
        ) {
          transformPageCall(t, path, opts);
        } else if (
          handbook &&
          'object' in path.node.callee &&
          'property' in path.node.callee &&
          t.isIdentifier(path.node.callee.object, { name: handbook }) &&
          t.isIdentifier(path.node.callee.property, { name: 'preview' })
        ) {
          transformPreviewCall(t, path, opts);
        }
      },
    },
  };
}
