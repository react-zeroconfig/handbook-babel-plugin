export type RootNode = Node & { children: Node[] };
export type HtmlNode = Node & { value: string };

export function isRootNode(node: Node): node is RootNode {
  return node.type === 'root';
}

export function isHtmlNode(node: Node): node is HtmlNode {
  return node.type === 'html' && typeof node.value === 'string';
}

// ---------------------------------------------
// copy from @types/unist
// ---------------------------------------------
/**
 * Syntactic units in unist syntax trees are called nodes.
 */
export interface Node {
  /**
   * The variant of a node.
   */
  type: string;

  /**
   * Information from the ecosystem.
   */
  data?: Data;

  /**
   * Location of a node in a source document.
   * Must not be present if a node is generated.
   */
  position?: Position;

  [key: string]: unknown;
}

/**
 * Information associated by the ecosystem with the node.
 * Space is guaranteed to never be specified by unist or specifications
 * implementing unist.
 */
export interface Data {
  [key: string]: unknown;
}

/**
 * Location of a node in a source file.
 */
export interface Position {
  /**
   * Place of the first character of the parsed source region.
   */
  start: Point;

  /**
   * Place of the first character after the parsed source region.
   */
  end: Point;

  /**
   * Start column at each index (plus start line) in the source region,
   * for elements that span multiple lines.
   */
  indent?: number[];
}

/**
 * One place in a source file.
 */
export interface Point {
  /**
   * Line in a source file (1-indexed integer).
   */
  line: number;

  /**
   * Column in a source file (1-indexed integer).
   */
  column: number;
  /**
   * Character in a source file (0-indexed integer).
   */
  offset?: number;
}
