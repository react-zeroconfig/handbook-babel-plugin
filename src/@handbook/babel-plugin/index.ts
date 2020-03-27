import { NodePath, Visitor } from '@babel/traverse';
import * as types from '@babel/types';
import { existsSync } from 'fs';
import { dirname, join, relative } from 'path';

//eslint-disable-next-line @typescript-eslint/typedef
const PACKAGE_NAME = '@handbook/source' as const;
//eslint-disable-next-line @typescript-eslint/typedef
const NAMESPACE = 'namespace' as const;
enum CallNames {
  PAGE = 'page',
  COMPONENT = 'component',
  SOURCE = 'source',
}

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
  return extensions.find((ext) => existsSync(loc + ext));
}

function getAbsoluteFileLocation(importName: string, opts: Opts): string | undefined {
  if (/^\./.test(importName)) {
    return join(dirname(opts.filename), importName);
  }

  const dir: string = dirname(importName);

  // TODO plugin config

  // /src/*
  if (existsSync(join(opts.cwd, 'src', dir))) {
    return join(opts.cwd, 'src', importName);
  }
  // /src/_packages/*
  else if (existsSync(join(opts.cwd, 'src/_packages', dir))) {
    return join(opts.cwd, 'src/_packages', importName);
  } else {
    return undefined;
  }
}

export function transformPageCall(t: typeof types, path: NodePath<types.CallExpression>, opts: Opts) {
  if (path.node.arguments.length > 1 || !t.isStringLiteral(path.node.arguments[0])) return;

  const importName: string = path.node.arguments[0].value;
  const absoulteFileLocation: string | undefined = getAbsoluteFileLocation(importName, opts);

  if (!absoulteFileLocation) return;

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

export function transformComponentCall(t: typeof types, path: NodePath<types.CallExpression>, opts: Opts) {
  if (path.node.arguments.length > 1 || !t.isStringLiteral(path.node.arguments[0])) return;

  const importName: string = path.node.arguments[0].value;
  const absoulteFileLocation: string | undefined = getAbsoluteFileLocation(importName, opts);

  if (!absoulteFileLocation) return;

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

export function transformSourceCall(t: typeof types, path: NodePath<types.CallExpression>, opts: Opts) {
  if (path.node.arguments.length > 1 || !t.isStringLiteral(path.node.arguments[0])) return;

  const importName: string = path.node.arguments[0].value;
  const absoulteFileLocation: string | undefined = getAbsoluteFileLocation(importName, opts);

  if (!absoulteFileLocation) return;

  const ext: string | undefined = getExtension(absoulteFileLocation, '.tsx', '.jsx', '.js', '.ts', '.mjs');

  if (!ext) return;

  path.node.arguments.push(
    t.objectExpression([
      t.objectProperty(
        t.identifier('source'),
        t.callExpression(t.identifier('require'), [t.stringLiteral(`!!raw-loader!${importName}`)]),
      ),
      t.objectProperty(t.identifier('filename'), t.stringLiteral(relative(opts.cwd, absoulteFileLocation) + ext)),
    ]),
  );
}

export default function ({ types: t }: Babel): BabelPlugin {
  let opts: Opts | null = null;
  const localNames: Map<typeof NAMESPACE | CallNames, string> = new Map();

  return {
    visitor: {
      Program(path: NodePath<types.Program>) {
        opts = path.hub.file.opts;
        localNames.clear();
      },

      ImportDeclaration(path: NodePath<types.ImportDeclaration>) {
        if (path.node.source.value !== PACKAGE_NAME) return;

        for (const specifier of path.node.specifiers) {
          // import * as ns from '@handbook/source'
          // import ns from '@handbook/source'
          if (t.isImportNamespaceSpecifier(specifier) || t.isImportDefaultSpecifier(specifier)) {
            localNames.set(NAMESPACE, specifier.local.name);
          }
          // import { example } from '@handbook/source'
          // import { example as another } from '@handbook/source'
          else if (t.isImportSpecifier(specifier)) {
            switch (specifier.imported.name) {
              case CallNames.PAGE:
              case CallNames.COMPONENT:
              case CallNames.SOURCE:
                localNames.set(specifier.imported.name, specifier.local.name);
                break;
            }
          }
        }
      },
      CallExpression(path: NodePath<types.CallExpression>) {
        if (!opts) return;

        function hasCall(path: NodePath<types.CallExpression>, callName: CallNames): boolean {
          return (
            // import { component } from '@handbook/source'
            // import { component as another } from '@handbook/source'
            (localNames.has(callName) && t.isIdentifier(path.node.callee, { name: localNames.get(callName) })) ||
            // import * as ns from '@handbook/source'
            // import ns from '@handbook/source'
            (localNames.has(NAMESPACE) &&
              'object' in path.node.callee &&
              'property' in path.node.callee &&
              t.isIdentifier(path.node.callee.object, { name: localNames.get(NAMESPACE) }) &&
              t.isIdentifier(path.node.callee.property, { name: callName }))
          );
        }

        if (hasCall(path, CallNames.PAGE)) {
          transformPageCall(t, path, opts);
        } else if (hasCall(path, CallNames.COMPONENT)) {
          transformComponentCall(t, path, opts);
        } else if (hasCall(path, CallNames.SOURCE)) {
          transformSourceCall(t, path, opts);
        }
      },
    },
  };
}
