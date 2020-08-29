import * as fs from 'fs';
import * as path from 'path';
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

  if (process.env.__SNAPSHOTS_DIRECTORY) {
    try {
      fs.writeFileSync(
        path.join(process.env.__SNAPSHOTS_DIRECTORY, '1.parse.json'),
        JSON.stringify(root, null, 2),
        { encoding: 'utf8' },
      );
      fs.writeFileSync(
        path.join(process.env.__SNAPSHOTS_DIRECTORY, '2.split-line.json'),
        JSON.stringify(output, null, 2),
        { encoding: 'utf8' },
      );
    } catch {}
  }

  return output;
}
