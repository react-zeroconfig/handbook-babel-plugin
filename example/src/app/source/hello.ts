/**
 * interface
 */
export interface Interface {
  /** a */
  a: string;
  /** b */
  b: number;
}

/**
 * type
 */
export type Type = {
  /** a */
  a: string;
  /** b */
  b: number;
};

/**
 * class
 */
export class Class {
  constructor() {
    console.log('constructor');
  }

  foo = () => {};

  bar() {}
}

/**
 * function
 */
export function func(): string {
  return 'Hello World!';
}

/**
 * currying
 */
export const currying = (a: number) => (b: number): number => {
  return a + b;
};
