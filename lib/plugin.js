"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const CORE = '@handbook/core';
function getExtension(loc, ...extensions) {
    if (process.env.JEST_WORKER_ID)
        return extensions[0];
    return extensions.find(ext => fs_1.existsSync(loc + ext));
}
function transformPageCall(t, path, opts) {
    if (path.node.arguments.length > 1 || !t.isStringLiteral(path.node.arguments[0]))
        return;
    const importName = path.node.arguments[0].value;
    const absoulteFileLocation = path_1.join(path_1.dirname(opts.filename), path.node.arguments[0].value);
    const ext = getExtension(absoulteFileLocation, '.mdx');
    if (!ext)
        return;
    path.node.arguments.push(t.objectExpression([
        t.objectProperty(t.identifier('component'), t.arrowFunctionExpression([], t.callExpression(t.identifier('import'), [t.stringLiteral(importName)]))),
        t.objectProperty(t.identifier('filename'), t.stringLiteral(path_1.relative(opts.cwd, absoulteFileLocation) + ext)),
    ]));
}
exports.transformPageCall = transformPageCall;
function transformPreviewCall(t, path, opts) {
    if (path.node.arguments.length > 1 || !t.isStringLiteral(path.node.arguments[0]))
        return;
    const importName = path.node.arguments[0].value;
    const absoulteFileLocation = path_1.join(path_1.dirname(opts.filename), path.node.arguments[0].value);
    const ext = getExtension(absoulteFileLocation, '.tsx', '.jsx', '.js', '.ts', '.mjs');
    if (!ext)
        return;
    path.node.arguments.push(t.objectExpression([
        t.objectProperty(t.identifier('component'), t.callExpression(t.identifier('require'), [t.stringLiteral(importName)])),
        t.objectProperty(t.identifier('source'), t.callExpression(t.identifier('require'), [t.stringLiteral(`!!raw-loader!${importName}`)])),
        t.objectProperty(t.identifier('filename'), t.stringLiteral(path_1.relative(opts.cwd, absoulteFileLocation) + ext)),
    ]));
}
exports.transformPreviewCall = transformPreviewCall;
function default_1({ types: t }) {
    let opts = null;
    let handbook = null;
    let page = null;
    let preview = null;
    return {
        visitor: {
            Program(path) {
                opts = path.hub.file.opts;
                handbook = null;
                page = null;
                preview = null;
            },
            ImportDeclaration(path) {
                if (path.node.source.value !== CORE)
                    return;
                for (const specifier of path.node.specifiers) {
                    if (t.isImportNamespaceSpecifier(specifier)) {
                        handbook = specifier.local.name;
                    }
                    else if (t.isImportDefaultSpecifier(specifier)) {
                        handbook = specifier.local.name;
                    }
                    else if (t.isImportSpecifier(specifier)) {
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
            CallExpression(path) {
                if (!opts)
                    return;
                if (page && t.isIdentifier(path.node.callee, { name: page })) {
                    transformPageCall(t, path, opts);
                }
                else if (preview && t.isIdentifier(path.node.callee, { name: preview })) {
                    transformPreviewCall(t, path, opts);
                }
                else if (handbook &&
                    'object' in path.node.callee &&
                    'property' in path.node.callee &&
                    t.isIdentifier(path.node.callee.object, { name: handbook }) &&
                    t.isIdentifier(path.node.callee.property, { name: 'page' })) {
                    transformPageCall(t, path, opts);
                }
                else if (handbook &&
                    'object' in path.node.callee &&
                    'property' in path.node.callee &&
                    t.isIdentifier(path.node.callee.object, { name: handbook }) &&
                    t.isIdentifier(path.node.callee.property, { name: 'preview' })) {
                    transformPreviewCall(t, path, opts);
                }
            },
        },
    };
}
exports.default = default_1;
//# sourceMappingURL=plugin.js.map