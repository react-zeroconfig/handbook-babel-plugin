import { isRootNode, Node } from '@handbook/remark-node-types';
import { Plugin } from 'unified';
import { transform } from './transform';

const plugin: Plugin<[]> = () => (node): Promise<Node> | void => {
  if (isRootNode(node)) {
    return transform(node);
  }
};

export = plugin;
