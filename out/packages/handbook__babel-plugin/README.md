# `@handbook/babel-plugin`

Install the babel plugin first

```sh
npm install @handbook/babel-plugin --save-dev
```

Then add it to your babel configuration like so

```
{
  "plugins": ["@handbook/babel-plugin"]
}
```

```js
source(() => import('../a'))
source(require('../a'))
```
