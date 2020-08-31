# Docs

<!-- source src/a/b/c.ts --pick "Pick" -->

[a/b/c.ts](src/a/b/c.ts)

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

<!-- source ./src/a/b/c.ts --pick "Pick" -->

[a/b/c.ts](src/a/b/c.ts)

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

[a/b/c.ts](src/a/b/c.ts)

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

<!-- source ./**/*.ts -->

[a/b/c.ts](src/a/b/c.ts)

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

<!-- index **/*.md -->

- [doc.md](doc.md)
- [a/b/d/doc.md](src/a/b/d/doc.md)
- [a/b/doc.md](src/a/b/doc.md)
- [a/doc.md](src/a/doc.md)
- [doc.md](src/doc.md)

<!-- /index -->

<!-- index ./**/*.md -->

- [doc.md](doc.md)
- [a/b/d/doc.md](src/a/b/d/doc.md)
- [a/b/doc.md](src/a/b/doc.md)
- [a/doc.md](src/a/doc.md)
- [doc.md](src/doc.md)

<!-- /index -->
