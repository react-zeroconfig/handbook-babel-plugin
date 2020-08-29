import { Plugin } from 'unified';
import { Node } from 'unist';
import { transform } from './transform';
import { isRootNode } from './types';

const plugin: Plugin<[]> = () => (node): Promise<Node> | void => {
  if (isRootNode(node)) {
    return transform(node);
  }
};

export = plugin;
