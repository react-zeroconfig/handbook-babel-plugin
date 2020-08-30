import { Node, RootNode } from '@handbook/remark-node-types';
import { sampling } from '@handbook/typescript-source-sampler';
import { glob } from '@ssen/promised';
import fs from 'fs-extra';
import flatten from 'lodash.flattendeep';
import fetch from 'node-fetch';
import path from 'path';
import { IndexNode, isIndexNode, isSourceNode, SourceNode } from './nodes';

async function indexToNodes(node: IndexNode, dirname: string): Promise<Node[]> {
  if (!Array.isArray(node.filePatterns) || node.filePatterns.length < 1) return [];

  const files: string[] = await Promise.all(
    node.filePatterns.map((pattern) =>
      glob(`${dirname}/${pattern}`, {
        ignore: ['**/node_modules/**', './node_modules/**'],
      }),
    ),
  ).then((...group) => flatten(group));

  return [
    {
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
    },
  ];
}

const urlPattern: RegExp = /^(http:|https:)/;

async function sourceToNodes(node: SourceNode, dirname: string): Promise<Node[]> {
  if (!Array.isArray(node.filePatterns) || node.filePatterns.length < 1) return [];

  const files: string[] = await Promise.all(
    node.filePatterns.map((pattern) => {
      return urlPattern.test(pattern)
        ? Promise.resolve([pattern])
        : glob(`${dirname}/${pattern}`, {
            ignore: ['**/node_modules/**', './node_modules/**'],
          });
    }),
  ).then((...group) => flatten(group));

  const nodes: Node[] = [];

  for (const file of files) {
    let source: string;
    let url: string;
    let title: string;

    if (urlPattern.test(file)) {
      source = await fetch(file).then((res) => res.text());
      url = file;
      title = file;
    } else {
      const relpath: string = path.relative(dirname, file).replace(/\\/g, '/');

      source = await fs.readFile(file, { encoding: 'utf8' });
      url = relpath;
      title = relpath.replace(/^(src\/)/, '');
    }

    if (/\.(js|jsx|ts|tsx)$/.test(file) && Array.isArray(node.pick) && node.pick.length > 0) {
      const samples = sampling({ samples: node.pick, source });
      source = Array.from(samples.values()).join('\n\n');
    }

    nodes.push(
      {
        type: 'paragraph',
        children: [
          {
            type: 'link',
            title: null,
            url,
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
        value: source,
      },
    );
  }

  return nodes;
}

export async function processCommand(root: RootNode, dirname: string): Promise<RootNode> {
  const children: Node[] = [];

  for (const node of root.children) {
    children.push(node);

    if (isIndexNode(node) && node.filePatterns) {
      const nodes: Node[] = await indexToNodes(node, dirname);
      children.push(...nodes);
    } else if (isSourceNode(node) && node.filePatterns) {
      const nodes: Node[] = await sourceToNodes(node, dirname);
      children.push(...nodes);
    }
  }

  const output = { ...root, children };

  if (process.env.__SNAPSHOTS_DIRECTORY) {
    try {
      fs.writeFileSync(
        path.join(process.env.__SNAPSHOTS_DIRECTORY, '4.process.json'),
        JSON.stringify(output, null, 2),
        { encoding: 'utf8' },
      );
    } catch {}
  }

  return output;
}
