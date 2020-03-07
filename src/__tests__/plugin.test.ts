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
      const preview: string = './samples/Sample';

      expect(
        format(
          transform(`
            import { page, preview } from '@handbook/core';
            page('${page}');
            preview('${preview}');
          `),
        ),
      ).toEqual(
        format(`
          import { page, preview } from '@handbook/core';
          page('${page}', {
            component: () => import('${page}'),
            filename: '${path.join(path.dirname(filename), page)}.mdx',
          });
          preview('${preview}', {
            component: require('${preview}'),
            source: require('!!raw-loader!${preview}'),
            filename: '${path.join(path.dirname(filename), preview)}.tsx',
          });
        `),
      );
    });

    test('should succeed in transform in jsx', () => {
      const page1: string = './pages/Page1';
      const page2: string = './pages/Page2';
      const preview1: string = './samples/Sample1';
      const preview2: string = './samples/Sample2';

      expect(
        format(
          transform(`
            import { page, preview } from '@handbook/core';
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
                  
                  <Preview source={preview('${preview1}')}/>
                  <Preview source={preview('${preview2}')}/>
                </div>
              )
            }
          `),
        ),
      ).toEqual(
        format(`
          import { page, preview } from '@handbook/core';
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
                
                <Preview source={preview('${preview1}', {
                  component: require('${preview1}'),
                  source: require('!!raw-loader!${preview1}'),
                  filename: '${path.join(path.dirname(filename), preview1)}.tsx',
                })}/>
                <Preview source={preview('${preview2}', {
                  component: require('${preview2}'),
                  source: require('!!raw-loader!${preview2}'),
                  filename: '${path.join(path.dirname(filename), preview2)}.tsx',
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
          import { page } from '@handbook/core';
          page('${file}');
        `),
        ),
      ).toEqual(
        format(`
        import { page } from '@handbook/core';
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
          import { page as pageX } from '@handbook/core';
          pageX('${file}');
        `),
        ),
      ).toEqual(
        format(`
        import { page as pageX } from '@handbook/core';
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
          import * as handbook from '@handbook/core';
          handbook.page('${file}');
        `),
        ),
      ).toEqual(
        format(`
        import * as handbook from '@handbook/core';
        handbook.page('${file}', {
          component: () => import('${file}'),
          filename: '${path.join(path.dirname(filename), file)}.mdx',
        });
      `),
      );

      expect(
        format(
          transform(`
          import * as handbook2 from '@handbook/core';
          handbook2.page('${file}');
        `),
        ),
      ).toEqual(
        format(`
        import * as handbook2 from '@handbook/core';
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
          import handbook from '@handbook/core';
          handbook.page('${file}');
        `),
        ),
      ).toEqual(
        format(`
        import handbook from '@handbook/core';
        handbook.page('${file}', {
          component: () => import('${file}'),
          filename: '${path.join(path.dirname(filename), file)}.mdx',
        });
      `),
      );

      expect(
        format(
          transform(`
          import handbook2 from '@handbook/core';
          handbook2.page('${file}');
        `),
        ),
      ).toEqual(
        format(`
        import handbook2 from '@handbook/core';
        handbook2.page('${file}', {
          component: () => import('${file}'),
          filename: '${path.join(path.dirname(filename), file)}.mdx',
        });
      `),
      );
    });
  });

  describe('preview()', () => {
    test('should succeed in transform', () => {
      const file: string = './samples/Sample1';

      expect(
        format(
          transform(`
          import { preview } from '@handbook/core';
          preview('${file}');
        `),
        ),
      ).toEqual(
        format(`
        import { preview } from '@handbook/core';
        preview('${file}', {
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
          import { preview as previewX } from '@handbook/core';
          previewX('${file}');
        `),
        ),
      ).toEqual(
        format(`
        import { preview as previewX } from '@handbook/core';
        previewX('${file}', {
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
          import * as handbook from '@handbook/core';
          handbook.preview('${file}');
        `),
        ),
      ).toEqual(
        format(`
        import * as handbook from '@handbook/core';
        handbook.preview('${file}', {
          component: require('${file}'),
          source: require('!!raw-loader!${file}'),
          filename: '${path.join(path.dirname(filename), file)}.tsx',
        });
      `),
      );

      expect(
        format(
          transform(`
          import * as handbook2 from '@handbook/core';
          handbook2.preview('${file}');
        `),
        ),
      ).toEqual(
        format(`
        import * as handbook2 from '@handbook/core';
        handbook2.preview('${file}', {
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
          import handbook from '@handbook/core';
          handbook.preview('${file}');
        `),
        ),
      ).toEqual(
        format(`
        import handbook from '@handbook/core';
        handbook.preview('${file}', {
          component: require('${file}'),
          source: require('!!raw-loader!${file}'),
          filename: '${path.join(path.dirname(filename), file)}.tsx',
        });
      `),
      );

      expect(
        format(
          transform(`
          import handbook2 from '@handbook/core';
          handbook2.preview('${file}');
        `),
        ),
      ).toEqual(
        format(`
        import handbook2 from '@handbook/core';
        handbook2.preview('${file}', {
          component: require('${file}'),
          source: require('!!raw-loader!${file}'),
          filename: '${path.join(path.dirname(filename), file)}.tsx',
        });
      `),
      );
    });
  });
});
