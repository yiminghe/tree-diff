/** @jsx dom */

/* eslint quotes:0, quote-props:0, comma-dangle:0 */

import expect from 'expect.js';
import renderDOM from '../src/dom/renderDOM';

function dom(type, props, ...children) {
  const ret = {
    type,
    props,
    children,
  };
  if (props && props.key) {
    ret.key = props.key;
    delete props.key;
  }
  return ret;
}

function simplifyOperations(operations) {
  return JSON.parse(JSON.stringify(operations, (k, v) => {
    return k === 'children' || k === 'props' ? undefined : v;
  }));
}

describe('tree-diff', () => {
  it('works without key', () => {
    const vdom1 = (<div>
      <h2>no key</h2>
      <p id="1">1</p>
      <p id="2">2</p>
      <button id="t">change</button>
    </div>);
    const container = document.createElement('div');
    const { update } = renderDOM(vdom1, container);
    const operations = update(<div>
      <h2>no key</h2>
      <p id="2">2</p>
      <p id="1">1</p>
      <p id="3">3</p>
      <button id="t">change</button>
    </div>);
    const containerChildNodes = container.childNodes[0].childNodes;
    expect(containerChildNodes.length).to.be(5);
    expect(containerChildNodes[0].nodeName.toLowerCase()).to.be('h2');
    expect(containerChildNodes[1].id).to.be('2');
    expect(containerChildNodes[2].id).to.be('1');
    expect(containerChildNodes[3].id).to.be('3');
    expect(containerChildNodes[4].nodeName.toLowerCase()).to.be('button');
    expect(simplifyOperations(operations)).to.eql({
      'insertQueue': [
        {
          'type': 'new',
          'nextNode': { 'type': 'p' },
          'parentNode': { 'type': 'div' },
          'toPath': [0, 3]
        },
        {
          'type': 'new',
          'nextNode': { 'type': 'button' },
          'parentNode': { 'type': 'div' },
          'toPath': [0, 4]
        }
      ],
      'updateQueue': [
        {
          'type': 'update',
          'currentNode': '2',
          'nextNode': '1',
          'parentNode': { 'type': 'p' },
          'path': [0, 2, 0]
        },
        {
          'type': 'update',
          'currentNode': '1',
          'nextNode': '2',
          'parentNode': { 'type': 'p' },
          'path': [0, 1, 0]
        },
        {
          'type': 'update',
          'currentNode': 'no key',
          'nextNode': 'no key',
          'parentNode': { 'type': 'h2' },
          'path': [0, 0, 0]
        },
        {
          'type': 'update',
          'currentNode': { 'type': 'h2' },
          'nextNode': { 'type': 'h2' },
          'parentNode': { 'type': 'div' },
          'path': [0, 0]
        },
        {
          'type': 'update',
          'currentNode': { 'type': 'p' },
          'nextNode': { 'type': 'p' },
          'parentNode': { 'type': 'div' },
          'path': [0, 1]
        },
        {
          'type': 'update',
          'currentNode': { 'type': 'p' },
          'nextNode': { 'type': 'p' },
          'parentNode': { 'type': 'div' },
          'path': [0, 2]
        },
        {
          'type': 'update',
          'currentNode': { 'type': 'div' },
          'nextNode': { 'type': 'div' },
          'path': [0]
        }
      ],
      'removeQueue': [
        {
          'type': 'remove',
          'currentNode': { 'type': 'button' },
          'parentNode': { 'type': 'div' },
          'currentIndex': 3,
          'path': [0, 3]
        }
      ]
    });
  });

  it('works with key', () => {
    const vdom1 = (<div>
      <h2>with key</h2>
      <p key="1">1</p>
      <p key="2">2</p>
      <button key="t" id="t2">change</button>
    </div>);
    const container = document.createElement('div');
    const { update } = renderDOM(vdom1, container);
    const operations = update(<div>
      <h2>with key</h2>
      <p key="2">2</p>
      <p key="1">1</p>
      <p key="3">3</p>
      <button key="t" id="t">change</button>
    </div>);
    const containerChildNodes = container.childNodes[0].childNodes;
    expect(containerChildNodes.length).to.be(5);
    expect(containerChildNodes[0].nodeName.toLowerCase()).to.be('h2');
    expect(containerChildNodes[1].textContent).to.be('2');
    expect(containerChildNodes[2].textContent).to.be('1');
    expect(containerChildNodes[3].textContent).to.be('3');
    expect(containerChildNodes[4].nodeName.toLowerCase()).to.be('button');
    expect(simplifyOperations(operations)).to.eql(
      {
        'insertQueue': [
          {
            'type': 'move',
            'currentNode': { 'type': 'p', 'key': '1' },
            'nextNode': { 'type': 'p', 'key': '1' },
            'parentNode': { 'type': 'div' },
            'currentIndex': 1,
            'path': [0, 1],
            'toPath': [0, 2]
          },
          {
            'type': 'new',
            'nextNode': { 'type': 'p', 'key': '3' },
            'parentNode': { 'type': 'div' },
            'toPath': [0, 3]
          }
        ],
        'updateQueue': [
          {
            'type': 'update',
            'currentNode': 'change',
            'nextNode': 'change',
            'parentNode': { 'type': 'button', 'key': 't' },
            'path': [0, 3, 0]
          },
          {
            'type': 'update',
            'currentNode': '1',
            'nextNode': '1',
            'parentNode': { 'type': 'p', 'key': '1' },
            'path': [0, 1, 0]
          },
          {
            'type': 'update',
            'currentNode': '2',
            'nextNode': '2',
            'parentNode': { 'type': 'p', 'key': '2' },
            'path': [0, 2, 0]
          },
          {
            'type': 'update',
            'currentNode': 'with key',
            'nextNode': 'with key',
            'parentNode': { 'type': 'h2' },
            'path': [0, 0, 0]
          },
          {
            'type': 'update',
            'currentNode': { 'type': 'h2' },
            'nextNode': { 'type': 'h2' },
            'parentNode': { 'type': 'div' },
            'path': [0, 0]
          },
          {
            'type': 'update',
            'currentNode': { 'type': 'p', 'key': '2' },
            'nextNode': { 'type': 'p', 'key': '2' },
            'parentNode': { 'type': 'div' },
            'path': [0, 2]
          },
          {
            'type': 'update',
            'currentNode': { 'type': 'p', 'key': '1' },
            'nextNode': { 'type': 'p', 'key': '1' },
            'parentNode': { 'type': 'div' },
            'path': [0, 1]
          },
          {
            'type': 'update',
            'currentNode': { 'type': 'button', 'key': 't' },
            'nextNode': { 'type': 'button', 'key': 't' },
            'parentNode': { 'type': 'div' },
            'path': [0, 3]
          },
          {
            'type': 'update',
            'currentNode': { 'type': 'div' },
            'nextNode': { 'type': 'div' },
            'path': [0]
          }
        ],
        'removeQueue': [
          {
            'type': 'move',
            'currentNode': { 'type': 'p', 'key': '1' },
            'nextNode': { 'type': 'p', 'key': '1' },
            'parentNode': { 'type': 'div' },
            'currentIndex': 1,
            'path': [0, 1],
            'toPath': [0, 2]
          }
        ]
      }
    );
  });
});
