import ts from 'typescript';

export function removeBodyStatements(node: ts.Node): ts.Node {
  if (ts.isVariableStatement(node)) {
    return ts.factory.updateVariableStatement(
      node,
      node.modifiers,
      removeBodyStatements(node.declarationList) as ts.VariableDeclarationList,
    );
  } else if (ts.isVariableDeclarationList(node)) {
    return ts.factory.updateVariableDeclarationList(
      node,
      node.declarations.map(
        (declaration) =>
          removeBodyStatements(declaration) as ts.VariableDeclaration,
      ),
    );
  } else if (ts.isClassDeclaration(node)) {
    return ts.factory.updateClassDeclaration(
      node,
      node.decorators,
      node.modifiers,
      node.name,
      node.typeParameters,
      node.heritageClauses,
      [],
      //node.members.map((member) => removeBody(member) as ts.ClassElement),
    );
  } else if (ts.isClassExpression(node)) {
    return ts.factory.updateClassExpression(
      node,
      node.decorators,
      node.modifiers,
      node.name,
      node.typeParameters,
      node.heritageClauses,
      [],
    );
  } else if (ts.isFunctionDeclaration(node) && node.body) {
    return ts.factory.updateFunctionDeclaration(
      node,
      node.decorators,
      node.modifiers,
      node.asteriskToken,
      node.name,
      node.typeParameters,
      node.parameters,
      node.type,
      ts.factory.createBlock([]),
    );
  } else if (ts.isFunctionExpression(node) && node.body) {
    return ts.factory.updateFunctionExpression(
      node,
      node.modifiers,
      node.asteriskToken,
      node.name,
      node.typeParameters,
      node.parameters,
      node.type,
      ts.factory.createBlock([]),
    );
  } else if (ts.isVariableDeclaration(node) && node.initializer) {
    return ts.factory.updateVariableDeclaration(
      node,
      node.name,
      node.exclamationToken,
      node.type,
      removeBodyStatements(node.initializer) as ts.Expression,
    );
  } else if (ts.isArrowFunction(node)) {
    if (ts.isArrowFunction(node.body)) {
      return ts.factory.updateArrowFunction(
        node,
        node.modifiers,
        node.typeParameters,
        node.parameters,
        node.type,
        node.equalsGreaterThanToken,
        removeBodyStatements(node.body) as ts.ConciseBody,
      );
    } else {
      return ts.factory.updateArrowFunction(
        node,
        node.modifiers,
        node.typeParameters,
        node.parameters,
        node.type,
        node.equalsGreaterThanToken,
        ts.factory.createBlock([]),
      );
    }
  }

  return node;
}
