import ts from 'typescript';

export function findExportNode(node: ts.Node): ts.Node {
  while (true) {
    if (!node.parent || node.parent.pos === 0) {
      return node;
    }
    node = node.parent;
  }
}
