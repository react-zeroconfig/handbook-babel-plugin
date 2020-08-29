import fs from 'fs';
import path from 'path';
import { Node } from 'unist';
import { IndexNode, resolveCommandNode, SourceNode } from './nodes';
import { RootNode } from './types';

export function transformCommand(root: RootNode): RootNode {
  const children: Node[] = [];

  let start: SourceNode | IndexNode | null = null;

  for (const node of root.children) {
    const command = resolveCommandNode(node);

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

  if (process.env.__SNAPSHOTS_DIRECTORY) {
    try {
      fs.writeFileSync(
        path.join(process.env.__SNAPSHOTS_DIRECTORY, '3.command.json'),
        JSON.stringify(output, null, 2),
        { encoding: 'utf8' },
      );
    } catch {}
  }

  return output;
}
