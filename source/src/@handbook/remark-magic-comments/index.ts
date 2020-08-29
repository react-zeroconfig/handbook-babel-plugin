import { Plugin } from 'unified';
import { Node } from 'unist';
import { processCommand } from './processCommand';
import { transformCommand } from './transformCommand';
import { isRootNode } from './types';

const plugin: Plugin<[]> = () => (node, { dirname = process.cwd() }): Promise<Node> | void => {
  if (isRootNode(node)) {
    return processCommand(transformCommand(node), dirname);
  }
};

export = plugin;
