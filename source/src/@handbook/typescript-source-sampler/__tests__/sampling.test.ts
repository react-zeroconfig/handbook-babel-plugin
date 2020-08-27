import { sampling } from '@handbook/typescript-source-sampler';
import prettier from 'prettier';

const source: string = `
/**
 * Foo....
 */
export interface X {
  a: string;
  b: number;
}

export interface Y {
  /** foo... */
  a: string;
  
  /** bar... */
  b: number;
}

interface Z {
}

/**
 * hello?
 */
export function x({ a, b }: { a: number, b: number }): number {
  console.log('hello world?');
  return a + b;
}

export function y() {
  console.log('hello world?');
}

/**
 * ????
 */
export const q = () => () => {
  console.log('xxx');
}

/**
 * hello?
 */
function z() {
  console.log('hello world?');
}

/** skjsksjk */
export const xx: string = 'aaaa';

export const yy: number = 12323;

const zz: string = 'sss';

/** kkdkdjdk */
export const nodes = <div>Hello?</div>;

/** fldjkjek */
export class Test {
  constructor(hello: string) {
  }
  
  function x(): string {
    return 'x';
  }
  
  y = () => {
    return 'y';
  }
}
`;

function format(source: string): string {
  return prettier.format(source, { parser: 'typescript' });
}

describe('@handbook/typescript-source-sampler', () => {
  test('should get the interface sample', () => {
    // Act
    const result = sampling({ samples: ['X'], source });

    // Assert
    expect(format(result.get('X') ?? '')).toBe(
      format(`
      /**
       * Foo....
       */
      export interface X {
        a: string;
        b: number;
      }
      `),
    );
  });

  test('should get the class sample', () => {
    // Act
    const result = sampling({ samples: ['Test'], source });

    // Assert
    expect(format(result.get('Test') ?? '')).toEqual(
      format(`
      /** fldjkjek */
      export class Test {}
      `),
    );
  });

  test('should get the function sample', () => {
    // Act
    const result = sampling({ samples: ['x'], source });

    // Assert
    expect(format(result.get('x') ?? '')).toEqual(
      format(`
      /**
       * hello?
       */
      export function x({ a, b }: { a: number, b: number }): number {};
      `),
    );
  });

  test('should get the variable sample', () => {
    // Act
    const result = sampling({ samples: ['xx'], source });

    // Assert
    expect(format(result.get('xx') ?? '')).toEqual(
      format(`
      /** skjsksjk */
      export const xx: string = 'aaaa';
      `),
    );
  });

  test('should get arrow function', () => {
    // Act
    const result = sampling({ samples: ['q'], source });

    // Assert
    expect(format(result.get('q') ?? '')).toEqual(
      format(`
      /**
       * ????
       */
      export const q = () => () => {}
      `),
    );
  });
});
