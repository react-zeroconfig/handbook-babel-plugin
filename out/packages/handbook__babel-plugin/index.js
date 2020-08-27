"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformSourceCallExpression = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const PACKAGE_NAME = '@handbook/source';
const NAMESPACE = 'namespace';
const SOURCE = 'source';
function getExtension(loc, ...extensions) {
    var _a;
    return (_a = process.env.HANDBOOK_TEST_EXT) !== null && _a !== void 0 ? _a : extensions.find((ext) => fs_1.default.existsSync(loc + ext));
}
function getAbsoluteFileLocation(importPath, babelOptions, pluginOptions) {
    var _a;
    if (/^\./.test(importPath)) {
        return path_1.default.resolve(path_1.default.dirname(babelOptions.filename), importPath);
    }
    const dir = path_1.default.dirname(importPath);
    const sourceRoot = (_a = pluginOptions.sourceRoot) !== null && _a !== void 0 ? _a : path_1.default.resolve(babelOptions.cwd, 'src');
    if (fs_1.default.existsSync(path_1.default.resolve(sourceRoot, dir))) {
        return path_1.default.resolve(sourceRoot, importPath);
    }
    else if (fs_1.default.existsSync(path_1.default.resolve(babelOptions.cwd, dir))) {
        return path_1.default.resolve(babelOptions.cwd, importPath);
    }
    else {
        return undefined;
    }
}
function getSourceRoot(babelOptions, pluginOptions) {
    if (typeof pluginOptions.sourceRoot === 'string')
        return pluginOptions.sourceRoot;
    if (fs_1.default.existsSync(path_1.default.resolve(babelOptions.cwd, 'src'))) {
        return path_1.default.resolve(babelOptions.cwd, 'src');
    }
    return babelOptions.cwd;
}
function getImportPath(t, args0) {
    if (t.isCallExpression(args0) &&
        t.isIdentifier(args0.callee) &&
        args0.callee.name === 'require' &&
        args0.arguments.length > 0 &&
        t.isStringLiteral(args0.arguments[0])) {
        return args0.arguments[0].value;
    }
    else if (t.isArrowFunctionExpression(args0) &&
        t.isCallExpression(args0.body) &&
        t.isImport(args0.body.callee) &&
        args0.body.arguments.length > 0 &&
        t.isStringLiteral(args0.body.arguments[0])) {
        return args0.body.arguments[0].value;
    }
    return undefined;
}
function transformSourceCallExpression(t, path, babelOptions, pluginOptions) {
    var _a;
    if (path.node.arguments.length < 1)
        return;
    const args0 = path.node.arguments[0];
    const importPath = getImportPath(t, args0);
    if (!importPath)
        return;
    const absoulteFileLocation = getAbsoluteFileLocation(importPath, babelOptions, pluginOptions);
    if (!absoulteFileLocation)
        return;
    const ext = getExtension(absoulteFileLocation, ...((_a = pluginOptions.targetExtensions) !== null && _a !== void 0 ? _a : ['.tsx', '.jsx', '.js', '.ts', '.mdx', '.mjs', '.mdx']));
    if (!ext)
        return;
    const sourceRoot = getSourceRoot(babelOptions, pluginOptions);
    path.node.arguments[0] = t.objectExpression([
        t.objectProperty(t.identifier('module'), args0),
        t.objectProperty(t.identifier('source'), t.memberExpression(t.callExpression(t.identifier('require'), [t.stringLiteral(`!!raw-loader!${importPath}`)]), t.identifier('default'))),
        t.objectProperty(t.identifier('filename'), t.stringLiteral(path_1.default.relative(sourceRoot, absoulteFileLocation) + ext)),
    ]);
}
exports.transformSourceCallExpression = transformSourceCallExpression;
//eslint-disable-next-line import/no-anonymous-default-export
function default_1({ types: t }, pluginOptions) {
    let babelOptions = null;
    const localNames = new Map();
    return {
        visitor: {
            Program(path) {
                babelOptions = path.hub.file.opts;
                localNames.clear();
            },
            ImportDeclaration(path) {
                if (path.node.source.value !== PACKAGE_NAME)
                    return;
                for (const specifier of path.node.specifiers) {
                    // import * as ns from '@handbook/source'
                    // import ns from '@handbook/source'
                    if (t.isImportNamespaceSpecifier(specifier) || t.isImportDefaultSpecifier(specifier)) {
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
            CallExpression(path) {
                if (!babelOptions)
                    return;
                function hasCall(path, callName) {
                    return (
                    // import { source } from '@handbook/source'
                    // import { source as another } from '@handbook/source'
                    (localNames.has(callName) &&
                        t.isIdentifier(path.node.callee, { name: localNames.get(callName) })) ||
                        // import * as ns from '@handbook/source'
                        // import ns from '@handbook/source'
                        (localNames.has(NAMESPACE) &&
                            'object' in path.node.callee &&
                            'property' in path.node.callee &&
                            t.isIdentifier(path.node.callee.object, { name: localNames.get(NAMESPACE) }) &&
                            t.isIdentifier(path.node.callee.property, { name: callName })));
                }
                if (hasCall(path, SOURCE)) {
                    transformSourceCallExpression(t, path, babelOptions, pluginOptions);
                }
            },
        },
    };
}
exports.default = default_1;
//# sourceMappingURL=index.js.map