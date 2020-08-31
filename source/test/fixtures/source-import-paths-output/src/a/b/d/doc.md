# Docs

<!-- source ../c.ts --pick "Pick" -->

[../c.ts](../c.ts)

```ts
/**
 * include item
 */
export interface Pick {
  /** foo */
  foo: number;
  /** bar */
  bar: number;
}
```

<!-- /source -->

<!-- source ../*.ts -->

[../c.ts](../c.ts)

```ts
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
```

<!-- /source -->
