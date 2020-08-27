import ts from 'typescript';
export declare function createSourceProgram(source: string, compilerOptions?: ts.CompilerOptions): ts.Program;
export declare function getExportNode(node: ts.Node): ts.Node;
export declare function removeBody(node: ts.Node): ts.Node;
export interface SamplingParams<S extends string> {
    source: string;
    samples: S[];
}
export declare function sampling<S extends string>({ source, samples }: SamplingParams<S>): Map<S, string>;
