import ts from 'typescript';

export function createSourceProgram(source: string, compilerOptions: ts.CompilerOptions = {}): ts.Program {
  const host: ts.CompilerHost = {
    getSourceFile: (
      fileName: string,
      languageVersion: ts.ScriptTarget,
      _onError?: (message: string) => void,
    ) => {
      return fileName === 'test.ts'
        ? ts.createSourceFile(fileName, source, languageVersion, false, ts.ScriptKind.TSX)
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
    resolveModuleNames: (_moduleNames: string[], _containingFile: string) => {
      return _moduleNames.map((moduleName) => ({
        resolvedFileName: moduleName + '.ts',
        isExternalLibraryImport: true,
      }));
    },
    getDirectories: (_path) => {
      throw new Error('unsupported');
    },
  };

  return ts.createProgram(['test.ts'], compilerOptions, host);
}

export function getExportNode(node: ts.Node): ts.Node {
  while (true) {
    if (!node.parent || node.parent.pos === 0) {
      return node;
    }
    node = node.parent;
  }
}

export function removeBody(node: ts.Node): ts.Node {
  if (ts.isVariableStatement(node)) {
    return ts.factory.updateVariableStatement(
      node,
      node.modifiers,
      removeBody(node.declarationList) as ts.VariableDeclarationList,
    );
  } else if (ts.isVariableDeclarationList(node)) {
    return ts.factory.updateVariableDeclarationList(
      node,
      node.declarations.map((declaration) => removeBody(declaration) as ts.VariableDeclaration),
    );
  } else if (ts.isClassDeclaration(node)) {
    return ts.factory.updateClassDeclaration(
      node,
      node.decorators,
      node.modifiers,
      node.name,
      node.typeParameters,
      node.heritageClauses,
      [],
      //node.members.map((member) => removeBody(member) as ts.ClassElement),
    );
  } else if (ts.isClassExpression(node)) {
    return ts.factory.updateClassExpression(
      node,
      node.decorators,
      node.modifiers,
      node.name,
      node.typeParameters,
      node.heritageClauses,
      [],
    );
  } else if (ts.isFunctionDeclaration(node) && node.body) {
    return ts.factory.updateFunctionDeclaration(
      node,
      node.decorators,
      node.modifiers,
      node.asteriskToken,
      node.name,
      node.typeParameters,
      node.parameters,
      node.type,
      ts.factory.createBlock([]),
    );
  } else if (ts.isFunctionExpression(node) && node.body) {
    return ts.factory.updateFunctionExpression(
      node,
      node.modifiers,
      node.asteriskToken,
      node.name,
      node.typeParameters,
      node.parameters,
      node.type,
      ts.factory.createBlock([]),
    );
  } else if (ts.isVariableDeclaration(node) && node.initializer) {
    return ts.factory.updateVariableDeclaration(
      node,
      node.name,
      node.exclamationToken,
      node.type,
      removeBody(node.initializer) as ts.Expression,
    );
  } else if (ts.isArrowFunction(node)) {
    if (ts.isArrowFunction(node.body)) {
      return ts.factory.updateArrowFunction(
        node,
        node.modifiers,
        node.typeParameters,
        node.parameters,
        node.type,
        node.equalsGreaterThanToken,
        removeBody(node.body) as ts.ConciseBody,
      );
    } else {
      return ts.factory.updateArrowFunction(
        node,
        node.modifiers,
        node.typeParameters,
        node.parameters,
        node.type,
        node.equalsGreaterThanToken,
        ts.factory.createBlock([]),
      );
    }
  }

  return node;
}

export interface SamplingParams<S extends string> {
  source: string;
  samples: S[];
}

export function sampling<S extends string>({ source, samples }: SamplingParams<S>): Map<S, string> {
  const program = createSourceProgram(source);
  const sourceFile = program.getSourceFile('test.ts')!;

  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

  const typeChecker = program.getTypeChecker();
  const symbol = typeChecker.getSymbolAtLocation(sourceFile)!;
  const exports = typeChecker.getExportsOfModule(symbol);

  const result = new Map<S, string>();

  for (const { escapedName, declarations, valueDeclaration } of exports) {
    const name = escapedName.toString();

    if (samples.length > 0 && samples.indexOf(name as S) === -1) continue;

    const node: ts.Declaration | undefined = valueDeclaration || declarations[0];

    if (node) {
      const next: ts.Node = removeBody(getExportNode(node));
      const text = printer.printNode(ts.EmitHint.Unspecified, next, sourceFile);
      result.set(name as S, text);
    }
  }

  return result;
}
