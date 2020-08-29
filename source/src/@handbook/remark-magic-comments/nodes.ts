import { Node } from 'unist';
import parser from 'yargs-parser';
import { HtmlNode, isHtmlNode } from './types';

export const indexStartPattern: RegExp = /^<!--\s*index(.*)-->\s*$/;
export const indexEndPattern: RegExp = /^<!--\s*\/index(.*)-->\s*$/;

export interface IndexNode extends HtmlNode {
  command: 'index';
  phase: 'start' | 'end';
  filePatterns?: string[];
}

export const sourceStartPattern: RegExp = /^<!--\s*source(.*)-->\s*$/;
export const sourceEndPattern: RegExp = /^<!--\s*\/source(.*)-->\s*$/;

export interface SourceNode extends HtmlNode {
  command: 'source';
  phase: 'start' | 'end';
  filePatterns?: string[];
  pick?: string[];
}

export type CommandNode = IndexNode | SourceNode;

export function isIndexNode(node: Node): node is IndexNode {
  return node.type === 'html' && node.command === 'index';
}

export function isSourceNode(node: Node): node is SourceNode {
  return node.type === 'html' && node.command === 'source';
}

export function toCommandNode(node: Node): CommandNode | undefined {
  if (!isHtmlNode(node)) {
    return undefined;
  } else if (sourceStartPattern.test(node.value)) {
    const match = node.value.match(sourceStartPattern);

    if (match) {
      const { _, pick } = parser(match[1], { string: ['pick'] });

      if (_.length > 0) {
        return {
          ...node,
          command: 'source',
          phase: 'start',
          filePatterns: _ as string[],
          pick: pick?.split(' ').filter((s: string) => s.length > 0),
        };
      }
    }
  } else if (sourceEndPattern.test(node.value)) {
    return {
      ...node,
      command: 'source',
      phase: 'end',
    };
  } else if (indexStartPattern.test(node.value)) {
    const match = node.value.match(indexStartPattern);

    if (match) {
      const { _ } = parser(match[1]);

      if (_.length > 0) {
        return {
          ...node,
          command: 'index',
          phase: 'start',
          filePatterns: _ as string[],
        };
      }
    }
  } else if (indexEndPattern.test(node.value)) {
    return {
      ...node,
      command: 'index',
      phase: 'end',
    };
  }

  return undefined;
}
