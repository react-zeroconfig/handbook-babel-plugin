"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sampling = exports.removeBody = exports.getExportNode = exports.createSourceProgram = void 0;
const typescript_1 = __importDefault(require("typescript"));
function createSourceProgram(source, compilerOptions = {}) {
    const host = {
        getSourceFile: (fileName, languageVersion, _onError) => {
            return fileName === 'test.ts'
                ? typescript_1.default.createSourceFile(fileName, source, languageVersion, false, typescript_1.default.ScriptKind.TSX)
                : undefined;
        },
        getDefaultLibFileName: () => '',
        writeFile: (_fileName, _content) => {
            throw new Error('unsupported');
        },
        getCurrentDirectory: () => __dirname,
        getCanonicalFileName: (fileName) => fileName,
        getNewLine: () => '\n',
        useCaseSensitiveFileNames: () => false,
        fileExists: (fileName) => fileName === 'test.ts',
        readFile: (fileName) => (fileName === 'test.ts' ? source : undefined),
        resolveModuleNames: (_moduleNames, _containingFile) => {
            return _moduleNames.map((moduleName) => ({
                resolvedFileName: moduleName + '.ts',
                isExternalLibraryImport: true,
            }));
        },
        getDirectories: (_path) => {
            throw new Error('unsupported');
        },
    };
    return typescript_1.default.createProgram(['test.ts'], compilerOptions, host);
}
exports.createSourceProgram = createSourceProgram;
function getExportNode(node) {
    while (true) {
        if (!node.parent || node.parent.pos === 0) {
            return node;
        }
        node = node.parent;
    }
}
exports.getExportNode = getExportNode;
function removeBody(node) {
    if (typescript_1.default.isVariableStatement(node)) {
        return typescript_1.default.factory.updateVariableStatement(node, node.modifiers, removeBody(node.declarationList));
    }
    else if (typescript_1.default.isVariableDeclarationList(node)) {
        return typescript_1.default.factory.updateVariableDeclarationList(node, node.declarations.map((declaration) => removeBody(declaration)));
    }
    else if (typescript_1.default.isClassDeclaration(node)) {
        return typescript_1.default.factory.updateClassDeclaration(node, node.decorators, node.modifiers, node.name, node.typeParameters, node.heritageClauses, []);
    }
    else if (typescript_1.default.isClassExpression(node)) {
        return typescript_1.default.factory.updateClassExpression(node, node.decorators, node.modifiers, node.name, node.typeParameters, node.heritageClauses, []);
    }
    else if (typescript_1.default.isFunctionDeclaration(node) && node.body) {
        return typescript_1.default.factory.updateFunctionDeclaration(node, node.decorators, node.modifiers, node.asteriskToken, node.name, node.typeParameters, node.parameters, node.type, typescript_1.default.factory.createBlock([]));
    }
    else if (typescript_1.default.isFunctionExpression(node) && node.body) {
        return typescript_1.default.factory.updateFunctionExpression(node, node.modifiers, node.asteriskToken, node.name, node.typeParameters, node.parameters, node.type, typescript_1.default.factory.createBlock([]));
    }
    else if (typescript_1.default.isVariableDeclaration(node) && node.initializer) {
        return typescript_1.default.factory.updateVariableDeclaration(node, node.name, node.exclamationToken, node.type, removeBody(node.initializer));
    }
    else if (typescript_1.default.isArrowFunction(node)) {
        if (typescript_1.default.isArrowFunction(node.body)) {
            return typescript_1.default.factory.updateArrowFunction(node, node.modifiers, node.typeParameters, node.parameters, node.type, node.equalsGreaterThanToken, removeBody(node.body));
        }
        else {
            return typescript_1.default.factory.updateArrowFunction(node, node.modifiers, node.typeParameters, node.parameters, node.type, node.equalsGreaterThanToken, typescript_1.default.factory.createBlock([]));
        }
    }
    return node;
}
exports.removeBody = removeBody;
function sampling({ source, samples }) {
    const program = createSourceProgram(source);
    const sourceFile = program.getSourceFile('test.ts');
    const printer = typescript_1.default.createPrinter({ newLine: typescript_1.default.NewLineKind.LineFeed });
    const typeChecker = program.getTypeChecker();
    const symbol = typeChecker.getSymbolAtLocation(sourceFile);
    const exports = typeChecker.getExportsOfModule(symbol);
    const result = new Map();
    for (const { escapedName, declarations, valueDeclaration } of exports) {
        const name = escapedName.toString();
        if (samples.length > 0 && samples.indexOf(name) === -1)
            continue;
        const node = valueDeclaration || declarations[0];
        if (node) {
            const next = removeBody(getExportNode(node));
            const text = printer.printNode(typescript_1.default.EmitHint.Unspecified, next, sourceFile);
            result.set(name, text);
        }
    }
    return result;
}
exports.sampling = sampling;
//# sourceMappingURL=index.js.map