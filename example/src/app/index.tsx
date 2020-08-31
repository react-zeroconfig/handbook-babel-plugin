import { source } from '@handbook/source';
import { sampling } from '@handbook/typescript-source-sampler';
import React from 'react';
import { render } from 'react-dom';
import { CodeBlock } from '@handbook/code-block';
import github from 'prism-react-renderer/themes/github';
import './style.css';

// source types
const withRequire = source(require('./source/hello'));
const withImport = source(() => import('./source/hello'));
const withString = source('./source/hello');

console.assert(withRequire.module.func() === 'Hello World!');
withImport
  .module()
  .then((module) => console.assert(module.func() === 'Hello World!'));
console.assert(withString.module === './source/hello');

console.assert(
  new Set([withRequire.source, withImport.source, withString.source]).size ===
    1,
);
console.assert(
  new Set([withRequire.filename, withImport.filename, withString.filename])
    .size === 1,
);

const samples = sampling({
  source: withRequire.source,
  samples: ['Interface', 'Type', 'Class', 'func', 'currying'],
});

const { source: iframeSource } = source('./iframe');

function App() {
  return (
    <div className="layout">
      <div>
        <div>
          <h3>{withRequire.filename}</h3>
          <CodeBlock
            language="typescript"
            theme={github}
            children={withRequire.source}
          />
        </div>
        <div>
          <h3>iframe with code block</h3>
          <iframe src="iframe.html" height={120}></iframe>
          <CodeBlock language="typescript" children={iframeSource} />
        </div>
      </div>
      <div>
        <div>
          <h3>Interface</h3>
          <CodeBlock
            language="typescript"
            children={samples.get('Interface') ?? ''}
          />
        </div>
        <div>
          <h3>Type</h3>
          <CodeBlock
            language="typescript"
            children={samples.get('Type') ?? ''}
          />
        </div>
        <div>
          <h3>Class</h3>
          <CodeBlock
            language="typescript"
            children={samples.get('Class') ?? ''}
          />
        </div>
        <div>
          <h3>func</h3>
          <CodeBlock
            language="typescript"
            children={samples.get('func') ?? ''}
          />
        </div>
        <div>
          <h3>currying</h3>
          <CodeBlock
            language="typescript"
            children={samples.get('currying') ?? ''}
          />
        </div>
      </div>
    </div>
  );
}

render(<App />, document.querySelector('#app'));

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}
