import { source } from '@handbook/source';
import { sampling } from '@handbook/typescript-source-sampler';
import React from 'react';
import { render } from 'react-dom';

const module1 = source(require('./source/hello'));
const module2 = source(() => import('./source/hello'));

console.assert(module1.module.hello() === 'Hello World!');
module2.module().then((module) => console.assert(module.hello() === 'Hello World!'));
console.assert(module1.source === module2.source);

const samples = sampling({ source: module1.source, samples: ['Type', 'Class', 'hello'] });

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
        <h3>{module1.filename}</h3>
        <code>{module1.source}</code>
      </pre>
      <pre>
        <h3>{module2.filename}</h3>
        <code>{module2.source}</code>
      </pre>
    </div>
  );
}

render(<App />, document.querySelector('#app'));

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}
