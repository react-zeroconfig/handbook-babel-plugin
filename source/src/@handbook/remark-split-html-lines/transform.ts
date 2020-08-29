import { Node } from 'unist';
import { isHtmlNode, RootNode } from './types';

export async function transform(root: RootNode): Promise<RootNode> {
  const children: Node[] = [];

  for (const node of root.children) {
    if (isHtmlNode(node)) {
      const lines = node.value.split('\n');

      if (lines.length === 1) {
        children.push(node);
      } else {
        children.push(
          ...lines.map((line) => ({
            type: 'html',
            value: line,
          })),
        );
      }
    } else {
      children.push(node);
    }
  }

  const output: RootNode = { ...root, children };
  return output;
}
