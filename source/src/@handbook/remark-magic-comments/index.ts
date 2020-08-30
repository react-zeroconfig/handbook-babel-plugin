import { isRootNode, Node } from '@handbook/remark-node-types';
import { Plugin } from 'unified';
import { processCommand } from './processCommand';
import { transformCommand } from './transformCommand';

const plugin: Plugin<[]> = () => (node, { dirname = process.cwd() }): Promise<Node> | void => {
  if (isRootNode(node)) {
    return processCommand(transformCommand(node), dirname);
  }
};

export = plugin;
