import { NodePath, Visitor } from '@babel/traverse';
import types from '@babel/types';
import fs from 'fs';
import nodePath from 'path';

const PACKAGE_NAME = '@handbook/source';
const NAMESPACE = 'namespace';
const SOURCE = 'source';

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

interface BabelOptions {
  cwd: string;
  filename: string;
}

interface PluginOptions {
  sourceRoot?: string;
  targetExtensions?: string[];
}

function getExtension(
  loc: string,
  ...extensions: string[]
): string | undefined {
  return (
    process.env.HANDBOOK_TEST_EXT ??
    extensions.find((ext) => fs.existsSync(loc + ext))
  );
}

function getAbsoluteFileLocation(
  importPath: string,
  babelOptions: BabelOptions,
  pluginOptions: PluginOptions,
): string | undefined {
  if (/^\./.test(importPath)) {
    return nodePath.resolve(
      nodePath.dirname(babelOptions.filename),
      importPath,
    );
  }

  const dir: string = nodePath.dirname(importPath);

  const sourceRoot: string =
    pluginOptions.sourceRoot ?? nodePath.resolve(babelOptions.cwd, 'src');

  if (fs.existsSync(nodePath.resolve(sourceRoot, dir))) {
    return nodePath.resolve(sourceRoot, importPath);
  } else if (fs.existsSync(nodePath.resolve(babelOptions.cwd, dir))) {
    return nodePath.resolve(babelOptions.cwd, importPath);
  } else {
    return undefined;
  }
}

function getSourceRoot(
  babelOptions: BabelOptions,
  pluginOptions: PluginOptions,
): string {
  if (typeof pluginOptions.sourceRoot === 'string')
    return pluginOptions.sourceRoot;

  if (fs.existsSync(nodePath.resolve(babelOptions.cwd, 'src'))) {
    return nodePath.resolve(babelOptions.cwd, 'src');
  }

  return babelOptions.cwd;
}

function getImportPath<T>(
  t: typeof types,
  args0:
    | types.Expression
    | types.SpreadElement
    | types.JSXNamespacedName
    | types.ArgumentPlaceholder,
): string | undefined {
  if (t.isStringLiteral(args0)) {
    return args0.value;
  } else if (
    t.isCallExpression(args0) &&
    t.isIdentifier(args0.callee) &&
    args0.callee.name === 'require' &&
    args0.arguments.length > 0 &&
    t.isStringLiteral(args0.arguments[0])
  ) {
    return args0.arguments[0].value;
  } else if (
    t.isArrowFunctionExpression(args0) &&
    t.isCallExpression(args0.body) &&
    t.isImport(args0.body.callee) &&
    args0.body.arguments.length > 0 &&
    t.isStringLiteral(args0.body.arguments[0])
  ) {
    return args0.body.arguments[0].value;
  }

  return undefined;
}

export function transformSourceCallExpression(
  t: typeof types,
  path: NodePath<types.CallExpression>,
  babelOptions: BabelOptions,
  pluginOptions: PluginOptions,
) {
  if (path.node.arguments.length < 1) return;

  const args0 = path.node.arguments[0];

  const importPath: string | undefined = getImportPath(t, args0);

  if (!importPath) return;

  const absoulteFileLocation: string | undefined = getAbsoluteFileLocation(
    importPath,
    babelOptions,
    pluginOptions,
  );

  if (!absoulteFileLocation) return;

  const targetExtensions: string[] = pluginOptions.targetExtensions ?? [
    '.tsx',
    '.jsx',
    '.js',
    '.ts',
    '.mjs',
    '.mdx',
    '.css',
    '.sass',
    '.scss',
    '.less',
    '.svg',
    '.yml',
    '.yaml',
    '.json',
  ];

  const pathHasExtname: boolean = fs.existsSync(absoulteFileLocation);

  const ext: string | undefined = pathHasExtname
    ? nodePath.extname(absoulteFileLocation)
    : getExtension(absoulteFileLocation, ...targetExtensions);

  if (!ext) return;

  const sourceRoot: string = getSourceRoot(babelOptions, pluginOptions);

  path.node.arguments[0] = t.objectExpression([
    t.objectProperty(t.identifier('module'), args0 as types.Expression),
    t.objectProperty(
      t.identifier('source'),
      t.memberExpression(
        t.callExpression(t.identifier('require'), [
          t.stringLiteral(`!!raw-loader!${importPath}`),
        ]),
        t.identifier('default'),
      ),
    ),
    t.objectProperty(
      t.identifier('filename'),
      t.stringLiteral(
        nodePath
          .relative(sourceRoot, absoulteFileLocation)
          .replace(/\\/g, '/') + (pathHasExtname ? '' : ext),
      ),
    ),
  ]);
}

//eslint-disable-next-line import/no-anonymous-default-export
export default function (
  { types: t }: Babel,
  pluginOptions: PluginOptions,
): BabelPlugin {
  let babelOptions: BabelOptions | null = null;
  const localNames: Map<typeof NAMESPACE | typeof SOURCE, string> = new Map();

  return {
    visitor: {
      Program(path: NodePath<types.Program>) {
        babelOptions = path.hub.file.opts;
        localNames.clear();
      },

      ImportDeclaration(path: NodePath<types.ImportDeclaration>) {
        if (path.node.source.value !== PACKAGE_NAME) return;

        for (const specifier of path.node.specifiers) {
          // import * as ns from '@handbook/source'
          // import ns from '@handbook/source'
          if (
            t.isImportNamespaceSpecifier(specifier) ||
            t.isImportDefaultSpecifier(specifier)
          ) {
            localNames.set(NAMESPACE, specifier.local.name);
          }
          // import { source } from '@handbook/source'
          // import { source as another } from '@handbook/source'
          else if (t.isImportSpecifier(specifier)) {
            switch (specifier.imported.name) {
              case SOURCE:
                localNames.set(specifier.imported.name, specifier.local.name);
                break;
            }
          }
        }
      },
      CallExpression(path: NodePath<types.CallExpression>) {
        if (!babelOptions) return;

        function hasCall(
          path: NodePath<types.CallExpression>,
          callName: typeof SOURCE,
        ): boolean {
          return (
            // import { source } from '@handbook/source'
            // import { source as another } from '@handbook/source'
            (localNames.has(callName) &&
              t.isIdentifier(path.node.callee, {
                name: localNames.get(callName),
              })) ||
            // import * as ns from '@handbook/source'
            // import ns from '@handbook/source'
            (localNames.has(NAMESPACE) &&
              'object' in path.node.callee &&
              'property' in path.node.callee &&
              t.isIdentifier(path.node.callee.object, {
                name: localNames.get(NAMESPACE),
              }) &&
              t.isIdentifier(path.node.callee.property, { name: callName }))
          );
        }

        if (hasCall(path, SOURCE)) {
          transformSourceCallExpression(t, path, babelOptions, pluginOptions);
        }
      },
    },
  };
}
