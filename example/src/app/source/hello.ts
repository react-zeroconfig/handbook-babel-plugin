/**
 * type
 */
export interface Type {
  /** a */
  a: string;
  /** b */
  b: number;
}

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
export function hello() {
  return 'Hello World!';
}
