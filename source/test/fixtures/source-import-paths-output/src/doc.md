# Docs

<!-- source a/b/c.ts --pick "Pick" -->

[a/b/c.ts](a/b/c.ts)

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

<!-- source ./a/b/c.ts --pick "Pick" -->

[a/b/c.ts](a/b/c.ts)

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

[a/b/c.ts](a/b/c.ts)

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

[a/b/c.ts](a/b/c.ts)

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
