import { sampling } from '@handbook/typescript-source-sampler';
import { glob } from '@ssen/promised';
import fs from 'fs-extra';
import path from 'path';
import { Node } from 'unist';
import { isIndexNode, isSourceNode } from './nodes';
import { RootNode } from './types';

export async function processCommand(root: RootNode, dirname: string): Promise<RootNode> {
  const children: Node[] = [];

  for (const node of root.children) {
    children.push(node);

    if (isIndexNode(node) && node.filePatterns) {
      const files: string[] = await Promise.all(
        node.filePatterns.map((pattern) =>
          glob(`${dirname}/${pattern}`, {
            ignore: ['**/node_modules/**', './node_modules/**'],
          }),
        ),
      ).then((...group) => group.flat(2));

      children.push({
        type: 'list',
        spread: false,
        checked: null,
        children: files.map((file) => {
          const relpath: string = path.relative(dirname, file).replace(/\\/g, '/');
          const title: string = relpath.replace(/^(src\/)/, '');
          return {
            type: 'paragraph',
            children: [
              {
                type: 'link',
                title: null,
                url: relpath,
                children: [
                  {
                    type: 'text',
                    value: title,
                  },
                ],
              },
            ],
          };
        }),
      });
    } else if (isSourceNode(node) && node.filePatterns) {
      const files: string[] = await Promise.all(
        node.filePatterns.map((pattern) =>
          glob(`${dirname}/${pattern}`, {
            ignore: ['**/node_modules/**', './node_modules/**'],
          }),
        ),
      ).then((...group) => group.flat(2));

      for (const file of files) {
        const source: string = await fs.readFile(file, 'utf8');
        const relpath: string = path.relative(dirname, file).replace(/\\/g, '/');
        const title: string = relpath.replace(/^(src\/)/, '');

        let code: string = source;

        if (/\.(ts|tsx)$/.test(file) && Array.isArray(node.pick) && node.pick.length > 0) {
          const samples = sampling({ samples: node.pick, source });
          code = Array.from(samples.values()).join('\n\n');
        }

        children.push(
          {
            type: 'paragraph',
            children: [
              {
                type: 'link',
                title: null,
                url: relpath,
                children: [
                  {
                    type: 'text',
                    value: title,
                  },
                ],
              },
            ],
          },
          {
            type: 'code',
            lang: path.extname(file).substr(1),
            meta: null,
            value: code,
          },
        );
      }
    }
  }

  const output = { ...root, children };
  return output;
}
