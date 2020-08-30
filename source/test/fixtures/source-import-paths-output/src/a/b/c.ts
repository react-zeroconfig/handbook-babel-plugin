/**
 * include item
 */
export interface Pick {
  /** foo */
  foo: number;
  
  /** bar */
  bar: number;
}

/**
 * exclude item
 */
export function drop() {
  return 'drop';
}