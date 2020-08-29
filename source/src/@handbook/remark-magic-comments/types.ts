import { Node } from 'unist';

export type RootNode = Node & { children: Node[] };
export type HtmlNode = Node & { value: string };

export function isRootNode(node: Node): node is RootNode {
  return node.type === 'root';
}

export function isHtmlNode(node: Node): node is HtmlNode {
  return node.type === 'html' && typeof node.value === 'string';
}