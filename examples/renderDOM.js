/** @jsx dom */

/* eslint no-console:0 */

import { dom, renderDOM } from 'tree-diff/src/dom/';

function simplifyOperations(operations) {
  return JSON.parse(JSON.stringify(operations, (k, v) => {
    return k === 'children' || k === 'props' ? undefined : v;
  }));
}

(() => {
  const vdom1 = (<div>
    <h2>no key</h2>
    <p id="1">1</p>
    <p id="2">2</p>
    <button id="t">change</button>
  </div>);
  const container = document.createElement('div');
  document.getElementById('__react-content').appendChild(container);

  const { update } = renderDOM(vdom1, container);

  document.getElementById('t').onclick = () => {
    const operations = update(<div>
      <h2>no key</h2>
      <p id="2">2</p>
      <p id="1">1</p>
      <p id="3">3</p>
      <button id="t">change</button>
    </div>);
    console.log('operations', (simplifyOperations(operations)));
  };
})();

(() => {
  const vdom1 = (<div>
    <h2>with key</h2>
    <p key="1">1</p>
    <p key="2">2</p>
    <button key="t" id="t2">change</button>
  </div>);
  const container = document.createElement('div');
  document.getElementById('__react-content').appendChild(container);

  const { update } = renderDOM(vdom1, container);

  document.getElementById('t2').onclick = () => {
    const operations = update(<div>
      <h2>with key</h2>
      <p key="2">2</p>
      <p key="1">1</p>
      <p key="3">3</p>
      <button key="t" id="t">change</button>
    </div>);

    console.log('operations', (simplifyOperations(operations)));
  };
})();
