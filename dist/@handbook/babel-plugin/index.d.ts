import { NodePath, Visitor } from '@babel/traverse';
import * as types from '@babel/types';
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
export declare function transformPageCall(t: typeof types, path: NodePath<types.CallExpression>, opts: Opts): void;
export declare function transformComponentCall(t: typeof types, path: NodePath<types.CallExpression>, opts: Opts): void;
export declare function transformSourceCall(t: typeof types, path: NodePath<types.CallExpression>, opts: Opts): void;
export default function ({ types: t }: Babel): BabelPlugin;
export {};
