import ts from 'typescript';
import { createSourceProgram, dummyFilename } from './createSourceProgram';
import { findExportNode } from './findExportNode';
import { removeBodyStatements } from './removeBodyStatements';

export interface SamplingParams<S extends string> {
  /** typescript source code */
  source: string;

  /**
   * item names
   *
   * `Name` of `export interface Name {}`
   *
   * Please note that the names must be `export` items
   */
  samples: S[];
}

/**
 * pick source codes
 *
 * @return Map<sample name, source code>
 */
export function sampling<S extends string>({
  source,
  samples,
}: SamplingParams<S>): Map<S, string> {
  const program = createSourceProgram(source);
  const sourceFile = program.getSourceFile(dummyFilename)!;

  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

  const typeChecker = program.getTypeChecker();
  const symbol = typeChecker.getSymbolAtLocation(sourceFile)!;
  const exports = typeChecker.getExportsOfModule(symbol);

  const result = new Map<S, string>();

  for (const { escapedName, declarations, valueDeclaration } of exports) {
    const name = escapedName.toString();

    if (samples.length > 0 && samples.indexOf(name as S) === -1) continue;

    const node: ts.Declaration | undefined =
      valueDeclaration || declarations[0];

    if (node) {
      const next: ts.Node = removeBodyStatements(findExportNode(node));
      const text = printer.printNode(ts.EmitHint.Unspecified, next, sourceFile);
      result.set(name as S, text);
    }
  }

  return result;
}
