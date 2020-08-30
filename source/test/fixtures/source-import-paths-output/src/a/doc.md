# Docs

<!-- source b/c.ts --pick "Pick" -->

[b/c.ts](b/c.ts)

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

<!-- source ./b/c.ts --pick "Pick" -->

[b/c.ts](b/c.ts)

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

<!-- source **/*.ts -->

[b/c.ts](b/c.ts)

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
  return "drop";
}
```

<!-- /source -->

<!-- source ./**/*.ts -->

[b/c.ts](b/c.ts)

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
  return "drop";
}
```

<!-- /source -->
