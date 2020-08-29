import { Node } from 'unist';
import { IndexNode, SourceNode, toCommandNode } from './nodes';
import { RootNode } from './types';

export function transformCommand(root: RootNode): RootNode {
  const children: Node[] = [];

  let start: SourceNode | IndexNode | null = null;

  for (const node of root.children) {
    const command = toCommandNode(node);

    if (start) {
      if (command?.command === start.command && command?.phase === 'end') {
        children.push(command);
        start = null;
      }
    } else {
      if (command?.phase === 'start') {
        children.push(command);
        start = command;
      } else {
        children.push(node);
      }
    }
  }

  const output = { ...root, children };
  return output;
}
