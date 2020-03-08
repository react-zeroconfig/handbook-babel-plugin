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
  describe('env', () => {
    test('should succeed in transform', () => {
      const page: string = './pages/Page1';
      const example: string = './samples/Sample';

      expect(
        format(
          transform(`
            import { page, example } from '@handbook/source';
            page('${page}');
            example('${example}');
          `),
        ),
      ).toEqual(
        format(`
          import { page, example } from '@handbook/source';
          page('${page}', {
            component: () => import('${page}'),
            filename: '${path.join(path.dirname(filename), page)}.mdx',
          });
          example('${example}', {
            component: require('${example}'),
            source: require('!!raw-loader!${example}'),
            filename: '${path.join(path.dirname(filename), example)}.tsx',
          });
        `),
      );
    });

    test('should succeed in transform in jsx', () => {
      const page1: string = './pages/Page1';
      const page2: string = './pages/Page2';
      const example1: string = './samples/Sample1';
      const example2: string = './samples/Sample2';

      expect(
        format(
          transform(`
            import { page, example } from '@handbook/source';
            import { Handbook, Preview } from '@handbook/components';
            
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
                  
                  <Preview source={example('${example1}')}/>
                  <Preview source={example('${example2}')}/>
                </div>
              )
            }
          `),
        ),
      ).toEqual(
        format(`
          import { page, example } from '@handbook/source';
          import { Handbook, Preview } from '@handbook/components';
          
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
                
                <Preview source={example('${example1}', {
                  component: require('${example1}'),
                  source: require('!!raw-loader!${example1}'),
                  filename: '${path.join(path.dirname(filename), example1)}.tsx',
                })}/>
                <Preview source={example('${example2}', {
                  component: require('${example2}'),
                  source: require('!!raw-loader!${example2}'),
                  filename: '${path.join(path.dirname(filename), example2)}.tsx',
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

  describe('example()', () => {
    test('should succeed in transform', () => {
      const file: string = './samples/Sample1';

      expect(
        format(
          transform(`
          import { example } from '@handbook/source';
          example('${file}');
        `),
        ),
      ).toEqual(
        format(`
        import { example } from '@handbook/source';
        example('${file}', {
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
          import { example as exampleX } from '@handbook/source';
          exampleX('${file}');
        `),
        ),
      ).toEqual(
        format(`
        import { example as exampleX } from '@handbook/source';
        exampleX('${file}', {
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
          handbook.example('${file}');
        `),
        ),
      ).toEqual(
        format(`
        import * as handbook from '@handbook/source';
        handbook.example('${file}', {
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
          handbook2.example('${file}');
        `),
        ),
      ).toEqual(
        format(`
        import * as handbook2 from '@handbook/source';
        handbook2.example('${file}', {
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
          handbook.example('${file}');
        `),
        ),
      ).toEqual(
        format(`
        import handbook from '@handbook/source';
        handbook.example('${file}', {
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
          handbook2.example('${file}');
        `),
        ),
      ).toEqual(
        format(`
        import handbook2 from '@handbook/source';
        handbook2.example('${file}', {
          component: require('${file}'),
          source: require('!!raw-loader!${file}'),
          filename: '${path.join(path.dirname(filename), file)}.tsx',
        });
      `),
      );
    });
  });
});
