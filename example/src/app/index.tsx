import { source } from '@handbook/source';
import { sampling } from '@handbook/typescript-source-sampler';
import React from 'react';
import { render } from 'react-dom';

// source types
const withRequire = source(require('./source/hello'));
const withImport = source(() => import('./source/hello'));
const withString = source('./source/hello');

console.assert(withRequire.module.hello() === 'Hello World!');
withImport.module().then((module) => console.assert(module.hello() === 'Hello World!'));
console.assert(withString.module === './source/hello');

console.assert(new Set([withRequire.source, withImport.source, withString.source]).size === 1);

const samples = sampling({ source: withRequire.source, samples: ['Type', 'Class', 'hello'] });

function App() {
  return (
    <div>
      <pre>
        <h3>Type</h3>
        <code>{samples.get('Type')}</code>
      </pre>
      <pre>
        <h3>Class</h3>
        <code>{samples.get('Class')}</code>
      </pre>
      <pre>
        <h3>hello</h3>
        <code>{samples.get('hello')}</code>
      </pre>
      <hr />
      <pre>
        <h3>{withRequire.filename}</h3>
        <code>{withRequire.source}</code>
      </pre>
      <pre>
        <h3>{withImport.filename}</h3>
        <code>{withImport.source}</code>
      </pre>
    </div>
  );
}

render(<App />, document.querySelector('#app'));

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}
