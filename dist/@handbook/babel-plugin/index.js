"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
//eslint-disable-next-line @typescript-eslint/typedef
const PACKAGE_NAME = '@handbook/source';
//eslint-disable-next-line @typescript-eslint/typedef
const NAMESPACE = 'namespace';
var CallNames;
(function (CallNames) {
    CallNames["PAGE"] = "page";
    CallNames["COMPONENT"] = "component";
    CallNames["SOURCE"] = "source";
})(CallNames || (CallNames = {}));
function getExtension(loc, ...extensions) {
    if (process.env.JEST_WORKER_ID)
        return extensions[0];
    return extensions.find((ext) => fs_1.existsSync(loc + ext));
}
function getAbsoluteFileLocation(importName, opts) {
    if (/^\./.test(importName)) {
        return path_1.join(path_1.dirname(opts.filename), importName);
    }
    const dir = path_1.dirname(importName);
    // TODO plugin config
    // /src/*
    if (fs_1.existsSync(path_1.join(opts.cwd, 'src', dir))) {
        return path_1.join(opts.cwd, 'src', importName);
    }
    // /src/_packages/*
    else if (fs_1.existsSync(path_1.join(opts.cwd, 'src/_packages', dir))) {
        return path_1.join(opts.cwd, 'src/_packages', importName);
    }
    else {
        return undefined;
    }
}
function transformPageCall(t, path, opts) {
    if (path.node.arguments.length > 1 || !t.isStringLiteral(path.node.arguments[0]))
        return;
    const importName = path.node.arguments[0].value;
    const absoulteFileLocation = getAbsoluteFileLocation(importName, opts);
    if (!absoulteFileLocation)
        return;
    const ext = getExtension(absoulteFileLocation, '.mdx');
    if (!ext)
        return;
    path.node.arguments.push(t.objectExpression([
        t.objectProperty(t.identifier('component'), t.arrowFunctionExpression([], t.callExpression(t.identifier('import'), [t.stringLiteral(importName)]))),
        t.objectProperty(t.identifier('filename'), t.stringLiteral(path_1.relative(opts.cwd, absoulteFileLocation) + ext)),
    ]));
}
exports.transformPageCall = transformPageCall;
function transformComponentCall(t, path, opts) {
    if (path.node.arguments.length > 1 || !t.isStringLiteral(path.node.arguments[0]))
        return;
    const importName = path.node.arguments[0].value;
    const absoulteFileLocation = getAbsoluteFileLocation(importName, opts);
    if (!absoulteFileLocation)
        return;
    const ext = getExtension(absoulteFileLocation, '.tsx', '.jsx', '.js', '.ts', '.mjs');
    if (!ext)
        return;
    path.node.arguments.push(t.objectExpression([
        t.objectProperty(t.identifier('component'), t.callExpression(t.identifier('require'), [t.stringLiteral(importName)])),
        t.objectProperty(t.identifier('source'), t.callExpression(t.identifier('require'), [t.stringLiteral(`!!raw-loader!${importName}`)])),
        t.objectProperty(t.identifier('filename'), t.stringLiteral(path_1.relative(opts.cwd, absoulteFileLocation) + ext)),
    ]));
}
exports.transformComponentCall = transformComponentCall;
function transformSourceCall(t, path, opts) {
    if (path.node.arguments.length > 1 || !t.isStringLiteral(path.node.arguments[0]))
        return;
    const importName = path.node.arguments[0].value;
    const absoulteFileLocation = getAbsoluteFileLocation(importName, opts);
    if (!absoulteFileLocation)
        return;
    const ext = getExtension(absoulteFileLocation, '.tsx', '.jsx', '.js', '.ts', '.mjs');
    if (!ext)
        return;
    path.node.arguments.push(t.objectExpression([
        t.objectProperty(t.identifier('source'), t.callExpression(t.identifier('require'), [t.stringLiteral(`!!raw-loader!${importName}`)])),
        t.objectProperty(t.identifier('filename'), t.stringLiteral(path_1.relative(opts.cwd, absoulteFileLocation) + ext)),
    ]));
}
exports.transformSourceCall = transformSourceCall;
function default_1({ types: t }) {
    let opts = null;
    const localNames = new Map();
    return {
        visitor: {
            Program(path) {
                opts = path.hub.file.opts;
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
            CallExpression(path) {
                if (!opts)
                    return;
                function hasCall(path, callName) {
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
                            t.isIdentifier(path.node.callee.property, { name: callName })));
                }
                if (hasCall(path, CallNames.PAGE)) {
                    transformPageCall(t, path, opts);
                }
                else if (hasCall(path, CallNames.COMPONENT)) {
                    transformComponentCall(t, path, opts);
                }
                else if (hasCall(path, CallNames.SOURCE)) {
                    transformSourceCall(t, path, opts);
                }
            },
        },
    };
}
exports.default = default_1;
//# sourceMappingURL=index.js.map