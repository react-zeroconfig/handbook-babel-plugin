import { isRootNode, Node } from '@handbook/remark-node-types';
import { Plugin } from 'unified';
import { processCommand } from './processCommand';
import { transformCommand } from './transformCommand';

const plugin: Plugin<[]> = () => (node, { path, dirname = process.cwd() }): Promise<Node> | void => {
  if (isRootNode(node)) {
    const transformed = transformCommand(node);
    const processed = processCommand(transformed, dirname);
    return processed;
  }
};

export = plugin;
