import { BabelFileResult, transform as babelTransform } from '@babel/core';
import path from 'path';
import prettier from 'prettier';
import plugin from '../plugin';

const cwd: string = path.join(__dirname, '../../');
const filename: string = 'src/dir/test.tsx';

function format(code: string): string {
  return prettier.format(code, { parser: 'typescript' });
}

function transform(code: string): string {
  const res: BabelFileResult | null = babelTransform(format(code), {
    babelrc: false,
    cwd,
    filename,
    plugins: [plugin, '@babel/plugin-syntax-jsx'],
  });

  if (!res || !res.code) {
                           throw new Error('plugin failed!');
                         }

  return res.code;
}

describe('plugin', () => {
  describe('error-cases', () => {
    test('2020-03-09', () => {
      expect(
        format(
          transform(`
          import { HandbookTreeNode } from '@handbook/components';
          import { page } from '@handbook/source';
          export const insightViewerPages = {
            Basic: {
              'Getting Started': page('./Basic/Getting_Started'),
            },
            '<InsightViewer>': {
              Basic: page('./InsightViewer/Basic'),
            },
            Annotation: {
              Contour: {
                Viewer: page('./Annotation/Contour/Viewer'),
              },
            },
          };
          `),
        ),
      ).toEqual(
        format(`
        import { HandbookTreeNode } from '@handbook/components';
        import { page } from '@handbook/source';
        export const insightViewerPages = {
          Basic: {
            'Getting Started': page('./Basic/Getting_Started', {
              component: () => import('./Basic/Getting_Started'),
              filename: '${path.join(path.dirname(filename), './Basic/Getting_Started')}.mdx',
            }),
          },
          '<InsightViewer>': {
            Basic: page('./InsightViewer/Basic', {
              component: () => import('./InsightViewer/Basic'),
              filename: '${path.join(path.dirname(filename), './InsightViewer/Basic')}.mdx',
            }),
          },
          Annotation: {
            Contour: {
              Viewer: page('./Annotation/Contour/Viewer', {
                component: () => import('./Annotation/Contour/Viewer'),
                filename: '${path.join(path.dirname(filename), './Annotation/Contour/Viewer')}.mdx',
              }),
            },
          },
        };
        `),
      );
    });
  });

  describe('env', () => {
    test('should succeed in transform', () => {
      const page: string = './pages/Page1';
      const component: string = './samples/Sample';
      const source: string = './samples/Sample';

      expect(
        format(
          transform(`
            import { page, component, source } from '@handbook/source';
            page('${page}');
            component('${component}');
            source('${component}');
          `),
        ),
      ).toEqual(
        format(`
          import { page, component, source } from '@handbook/source';
          page('${page}', {
            component: () => import('${page}'),
            filename: '${path.join(path.dirname(filename), page)}.mdx',
          });
          component('${component}', {
            component: require('${component}'),
            source: require('!!raw-loader!${component}'),
            filename: '${path.join(path.dirname(filename), component)}.tsx',
          });
          source('${component}', {
            source: require('!!raw-loader!${component}'),
            filename: '${path.join(path.dirname(filename), component)}.tsx',
          });
        `),
      );
    });

    test('should succeed in transform in jsx', () => {
      const page1: string = './pages/Page1';
      const page2: string = './pages/Page2';
      const component1: string = './samples/Sample1';
      const component2: string = './samples/Sample2';
      const source1: string = './samples/Sample1';
      const source2: string = './samples/Sample2';

      expect(
        format(
          transform(`
            import { page, component, source } from '@handbook/source';
            import { Handbook, Preview, CodeBlock } from '@handbook/components';
            
            function App() {
              return (
                <div>
                  <Handbook>
                    {{
                      index: {
                        Title1: page('${page1}'),
                        Title2: page('${page2}'),
                      }
                    }}
                  </Handbook>
                  
                  <Preview source={component('${component1}')}/>
                  <Preview source={component('${component2}')}/>
                  
                  <CodeBlock source={source('${source1}')}/>
                  <CodeBlock source={source('${source2}')}/>
                </div>
              )
            }
          `),
        ),
      ).toEqual(
        format(`
          import { page, component, source } from '@handbook/source';
          import { Handbook, Preview, CodeBlock } from '@handbook/components';
          
          function App() {
            return (
              <div>
                <Handbook>
                  {{
                    index: {
                      Title1: page('${page1}', {
                        component: () => import('${page1}'),
                        filename: '${path.join(path.dirname(filename), page1)}.mdx',
                      }),
                      Title2: page('${page2}', {
                        component: () => import('${page2}'),
                        filename: '${path.join(path.dirname(filename), page2)}.mdx',
                      }),
                    }
                  }}
                </Handbook>
                
                <Preview source={component('${component1}', {
                  component: require('${component1}'),
                  source: require('!!raw-loader!${component1}'),
                  filename: '${path.join(path.dirname(filename), component1)}.tsx',
                })}/>
                <Preview source={component('${component2}', {
                  component: require('${component2}'),
                  source: require('!!raw-loader!${component2}'),
                  filename: '${path.join(path.dirname(filename), component2)}.tsx',
                })}/>
                
                <CodeBlock source={source('${source1}', {
                  source: require('!!raw-loader!${source1}'),
                  filename: '${path.join(path.dirname(filename), source1)}.tsx',
                })}/>
                <CodeBlock source={source('${source2}', {
                  source: require('!!raw-loader!${source2}'),
                  filename: '${path.join(path.dirname(filename), source2)}.tsx',
                })}/>
              </div>
            )
          }
        `),
      );
    });
  });

  describe('page()', () => {
    test('should succeed in transform', () => {
      const file: string = './pages/Page1';

      expect(
        format(
          transform(`
          import { page } from '@handbook/source';
          page('${file}');
        `),
        ),
      ).toEqual(
        format(`
        import { page } from '@handbook/source';
        page('${file}', {
          component: () => import('${file}'),
          filename: '${path.join(path.dirname(filename), file)}.mdx',
        });
      `),
      );
    });

    test('should succeed in transform by local name import', () => {
      const file: string = './pages/Page1';

      expect(
        format(
          transform(`
          import { page as pageX } from '@handbook/source';
          pageX('${file}');
        `),
        ),
      ).toEqual(
        format(`
        import { page as pageX } from '@handbook/source';
        pageX('${file}', {
          component: () => import('${file}'),
          filename: '${path.join(path.dirname(filename), file)}.mdx',
        });
      `),
      );
    });

    test('should succeed in transform by namespace import', () => {
      const file: string = './pages/Page1';

      expect(
        format(
          transform(`
          import * as handbook from '@handbook/source';
          handbook.page('${file}');
        `),
        ),
      ).toEqual(
        format(`
        import * as handbook from '@handbook/source';
        handbook.page('${file}', {
          component: () => import('${file}'),
          filename: '${path.join(path.dirname(filename), file)}.mdx',
        });
      `),
      );

      expect(
        format(
          transform(`
          import * as handbook2 from '@handbook/source';
          handbook2.page('${file}');
        `),
        ),
      ).toEqual(
        format(`
        import * as handbook2 from '@handbook/source';
        handbook2.page('${file}', {
          component: () => import('${file}'),
          filename: '${path.join(path.dirname(filename), file)}.mdx',
        });
      `),
      );
    });

    test('should succeed in transform by default import', () => {
      const file: string = './pages/Page1';

      expect(
        format(
          transform(`
          import handbook from '@handbook/source';
          handbook.page('${file}');
        `),
        ),
      ).toEqual(
        format(`
        import handbook from '@handbook/source';
        handbook.page('${file}', {
          component: () => import('${file}'),
          filename: '${path.join(path.dirname(filename), file)}.mdx',
        });
      `),
      );

      expect(
        format(
          transform(`
          import handbook2 from '@handbook/source';
          handbook2.page('${file}');
        `),
        ),
      ).toEqual(
        format(`
        import handbook2 from '@handbook/source';
        handbook2.page('${file}', {
          component: () => import('${file}'),
          filename: '${path.join(path.dirname(filename), file)}.mdx',
        });
      `),
      );
    });
  });

  describe('component()', () => {
    test('should succeed in transform', () => {
      const file: string = './samples/Sample1';

      expect(
        format(
          transform(`
          import { component } from '@handbook/source';
          component('${file}');
        `),
        ),
      ).toEqual(
        format(`
        import { component } from '@handbook/source';
        component('${file}', {
          component: require('${file}'),
          source: require('!!raw-loader!${file}'),
          filename: '${path.join(path.dirname(filename), file)}.tsx',
        });
      `),
      );
    });

    test('should succeed in transform by local name import', () => {
      const file: string = './samples/Sample1';

      expect(
        format(
          transform(`
          import { component as componentX } from '@handbook/source';
          componentX('${file}');
        `),
        ),
      ).toEqual(
        format(`
        import { component as componentX } from '@handbook/source';
        componentX('${file}', {
          component: require('${file}'),
          source: require('!!raw-loader!${file}'),
          filename: '${path.join(path.dirname(filename), file)}.tsx',
        });
      `),
      );
    });

    test('should succeed in transform by namespace import', () => {
      const file: string = './samples/Sample1';

      expect(
        format(
          transform(`
          import * as handbook from '@handbook/source';
          handbook.component('${file}');
        `),
        ),
      ).toEqual(
        format(`
        import * as handbook from '@handbook/source';
        handbook.component('${file}', {
          component: require('${file}'),
          source: require('!!raw-loader!${file}'),
          filename: '${path.join(path.dirname(filename), file)}.tsx',
        });
      `),
      );

      expect(
        format(
          transform(`
          import * as handbook2 from '@handbook/source';
          handbook2.component('${file}');
        `),
        ),
      ).toEqual(
        format(`
        import * as handbook2 from '@handbook/source';
        handbook2.component('${file}', {
          component: require('${file}'),
          source: require('!!raw-loader!${file}'),
          filename: '${path.join(path.dirname(filename), file)}.tsx',
        });
      `),
      );
    });

    test('should succeed in transform by default import', () => {
      const file: string = './samples/Sample1';

      expect(
        format(
          transform(`
          import handbook from '@handbook/source';
          handbook.component('${file}');
        `),
        ),
      ).toEqual(
        format(`
        import handbook from '@handbook/source';
        handbook.component('${file}', {
          component: require('${file}'),
          source: require('!!raw-loader!${file}'),
          filename: '${path.join(path.dirname(filename), file)}.tsx',
        });
      `),
      );

      expect(
        format(
          transform(`
          import handbook2 from '@handbook/source';
          handbook2.component('${file}');
        `),
        ),
      ).toEqual(
        format(`
        import handbook2 from '@handbook/source';
        handbook2.component('${file}', {
          component: require('${file}'),
          source: require('!!raw-loader!${file}'),
          filename: '${path.join(path.dirname(filename), file)}.tsx',
        });
      `),
      );
    });
  });

  describe('source()', () => {
    test('should succeed in transform', () => {
      const file: string = './samples/Sample1';

      expect(
        format(
          transform(`
          import { source } from '@handbook/source';
          source('${file}');
        `),
        ),
      ).toEqual(
        format(`
        import { source } from '@handbook/source';
        source('${file}', {
          source: require('!!raw-loader!${file}'),
          filename: '${path.join(path.dirname(filename), file)}.tsx',
        });
      `),
      );
    });

    test('should succeed in transform by local name import', () => {
      const file: string = './samples/Sample1';

      expect(
        format(
          transform(`
          import { source as sourceX } from '@handbook/source';
          sourceX('${file}');
        `),
        ),
      ).toEqual(
        format(`
        import { source as sourceX } from '@handbook/source';
        sourceX('${file}', {
          source: require('!!raw-loader!${file}'),
          filename: '${path.join(path.dirname(filename), file)}.tsx',
        });
      `),
      );
    });

    test('should succeed in transform by namespace import', () => {
      const file: string = './samples/Sample1';

      expect(
        format(
          transform(`
          import * as handbook from '@handbook/source';
          handbook.source('${file}');
        `),
        ),
      ).toEqual(
        format(`
        import * as handbook from '@handbook/source';
        handbook.source('${file}', {
          source: require('!!raw-loader!${file}'),
          filename: '${path.join(path.dirname(filename), file)}.tsx',
        });
      `),
      );

      expect(
        format(
          transform(`
          import * as handbook2 from '@handbook/source';
          handbook2.source('${file}');
        `),
        ),
      ).toEqual(
        format(`
        import * as handbook2 from '@handbook/source';
        handbook2.source('${file}', {
          source: require('!!raw-loader!${file}'),
          filename: '${path.join(path.dirname(filename), file)}.tsx',
        });
      `),
      );
    });

    test('should succeed in transform by default import', () => {
      const file: string = './samples/Sample1';

      expect(
        format(
          transform(`
          import handbook from '@handbook/source';
          handbook.source('${file}');
        `),
        ),
      ).toEqual(
        format(`
        import handbook from '@handbook/source';
        handbook.source('${file}', {
          source: require('!!raw-loader!${file}'),
          filename: '${path.join(path.dirname(filename), file)}.tsx',
        });
      `),
      );

      expect(
        format(
          transform(`
          import handbook2 from '@handbook/source';
          handbook2.source('${file}');
        `),
        ),
      ).toEqual(
        format(`
        import handbook2 from '@handbook/source';
        handbook2.source('${file}', {
          source: require('!!raw-loader!${file}'),
          filename: '${path.join(path.dirname(filename), file)}.tsx',
        });
      `),
      );
    });
  });
});
