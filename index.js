const handbookPlugin = ({ types: t }) => {
  return {
    visitor: {
      Program: {
        enter(programPath) {
          //const filename = programPath.hub.file.opts.filename;

          programPath.traverse({
            CallExpression(path) {
              if (path.get('callee').isIdentifier({ name: 'page' })) {
                const arg0 = path.get('arguments.0');
                if (!arg0 || !arg0.isStringLiteral()) {
                  throw new Error(`arguments.0 is not a StringLiteral`);
                }

                path.node.arguments.push(
                  t.arrowFunctionExpression(
                    [],
                    t.callExpression(t.identifier('import'), [t.stringLiteral(arg0.node.value + '.mdx')]),
                  ),
                );
              }
            },
            JSXOpeningElement(path) {
              if (path.get('name').isJSXIdentifier({ name: 'Sample' })) {
                path.traverse({
                  JSXAttribute(attrPath) {
                    if (attrPath.get('name').isJSXIdentifier({ name: 'path' })) {
                      const value = attrPath.get('value');

                      if (!value || !value.isStringLiteral()) {
                        throw new Error(`value is not a StringLiteral`);
                      }

                      path.node.attributes.push(
                        t.jSXAttribute(
                          t.jsxIdentifier('components'),
                          t.jSXExpressionContainer(
                            t.objectExpression([
                              t.objectProperty(
                                t.identifier('component'),
                                t.callExpression(t.identifier('require'), [t.stringLiteral(value.node.value)]),
                              ),
                              t.objectProperty(
                                t.identifier('source'),
                                t.callExpression(t.identifier('require'), [
                                  t.stringLiteral(`!!raw-loader!${value.node.value}`),
                                ]),
                              ),
                            ]),
                          ),
                        ),
                      );
                    }
                  },
                });
              }
            },
          });
        },
      },
    },
  };
};

module.exports = handbookPlugin;
