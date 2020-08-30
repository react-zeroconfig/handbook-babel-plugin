import ts from 'typescript';

export const dummyFilename: string = 'test.ts';

export function createSourceProgram(source: string, compilerOptions: ts.CompilerOptions = {}): ts.Program {
  const host: ts.CompilerHost = {
    getSourceFile: (
      fileName: string,
      languageVersion: ts.ScriptTarget,
      _onError?: (message: string) => void,
    ) => {
      return fileName === dummyFilename
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
    fileExists: (fileName) => fileName === dummyFilename,
    readFile: (fileName) => (fileName === dummyFilename ? source : undefined),
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

  return ts.createProgram([dummyFilename], compilerOptions, host);
}
