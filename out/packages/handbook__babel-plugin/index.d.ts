import { NodePath, Visitor } from '@babel/traverse';
import types from '@babel/types';
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
export declare function transformSourceCallExpression(t: typeof types, path: NodePath<types.CallExpression>, babelOptions: BabelOptions, pluginOptions: PluginOptions): void;
export default function ({ types: t }: Babel, pluginOptions: PluginOptions): BabelPlugin;
export {};
