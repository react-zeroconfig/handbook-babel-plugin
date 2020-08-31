import React from 'react';
import { render } from 'react-dom';

function App() {
  return (
    <div>
      <p>
        When you edit "iframe.tsx" file. this preview and that code block on
        below will reload.
      </p>
      <div
        style={{
          position: 'fixed',
          right: 10,
          bottom: 10,
          borderRadius: '50%',
          width: 50,
          height: 50,
          backgroundColor: 'white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        👍
      </div>
    </div>
  );
}

render(<App />, document.querySelector('#app'));

// Hot Module Replacement
if (module.hot) {
  module.hot.accept();
}
