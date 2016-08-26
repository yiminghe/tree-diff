/** @jsx dom */

/* eslint quotes:0, quote-props:0, comma-dangle:0 */

import expect from 'expect.js';
import { dom, renderDOM } from '../src/dom/';

function simplifyOperations(operations) {
  return JSON.parse(JSON.stringify(operations, (k, v) => {
    return k === 'children' || k === 'props' ||
    k === 'fromIndex' || k === 'toIndex' ? undefined : v;
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
          'afterNode': { 'type': 'p' },
          'parentNode': { 'type': 'div' },
          'toPath': [0, 3]
        },
        {
          'type': 'new',
          'afterNode': { 'type': 'button' },
          'parentNode': { 'type': 'div' },
          'toPath': [0, 4]
        }
      ],
      'updateQueue': [
        {
          'type': 'update',
          'fromNode': '2',
          'afterNode': '1',
          'parentNode': { 'type': 'p' },
          'fromPath': [0, 2, 0]
        },
        {
          'type': 'update',
          'fromNode': '1',
          'afterNode': '2',
          'parentNode': { 'type': 'p' },
          'fromPath': [0, 1, 0]
        },
        {
          'type': 'update',
          'fromNode': 'no key',
          'afterNode': 'no key',
          'parentNode': { 'type': 'h2' },
          'fromPath': [0, 0, 0]
        },
        {
          'type': 'update',
          'fromNode': { 'type': 'h2' },
          'afterNode': { 'type': 'h2' },
          'parentNode': { 'type': 'div' },
          'fromPath': [0, 0]
        },
        {
          'type': 'update',
          'fromNode': { 'type': 'p' },
          'afterNode': { 'type': 'p' },
          'parentNode': { 'type': 'div' },
          'fromPath': [0, 1]
        },
        {
          'type': 'update',
          'fromNode': { 'type': 'p' },
          'afterNode': { 'type': 'p' },
          'parentNode': { 'type': 'div' },
          'fromPath': [0, 2]
        },
        {
          'type': 'update',
          'fromNode': { 'type': 'div' },
          'afterNode': { 'type': 'div' },
          'fromPath': [0]
        }
      ],
      'removeQueue': [
        {
          'type': 'remove',
          'fromNode': { 'type': 'button' },
          'parentNode': { 'type': 'div' },
          'fromPath': [0, 3]
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
            'fromNode': { 'type': 'p', 'key': '1' },
            'afterNode': { 'type': 'p', 'key': '1' },
            'parentNode': { 'type': 'div' },
            'fromPath': [0, 1],
            'toPath': [0, 2]
          },
          {
            'type': 'new',
            'afterNode': { 'type': 'p', 'key': '3' },
            'parentNode': { 'type': 'div' },
            'toPath': [0, 3]
          }
        ],
        'updateQueue': [
          {
            'type': 'update',
            'fromNode': 'change',
            'afterNode': 'change',
            'parentNode': { 'type': 'button', 'key': 't' },
            'fromPath': [0, 3, 0]
          },
          {
            'type': 'update',
            'fromNode': '1',
            'afterNode': '1',
            'parentNode': { 'type': 'p', 'key': '1' },
            'fromPath': [0, 1, 0]
          },
          {
            'type': 'update',
            'fromNode': '2',
            'afterNode': '2',
            'parentNode': { 'type': 'p', 'key': '2' },
            'fromPath': [0, 2, 0]
          },
          {
            'type': 'update',
            'fromNode': 'with key',
            'afterNode': 'with key',
            'parentNode': { 'type': 'h2' },
            'fromPath': [0, 0, 0]
          },
          {
            'type': 'update',
            'fromNode': { 'type': 'h2' },
            'afterNode': { 'type': 'h2' },
            'parentNode': { 'type': 'div' },
            'fromPath': [0, 0]
          },
          {
            'type': 'update',
            'fromNode': { 'type': 'p', 'key': '2' },
            'afterNode': { 'type': 'p', 'key': '2' },
            'parentNode': { 'type': 'div' },
            'fromPath': [0, 2]
          },
          {
            'type': 'update',
            'fromNode': { 'type': 'p', 'key': '1' },
            'afterNode': { 'type': 'p', 'key': '1' },
            'parentNode': { 'type': 'div' },
            'fromPath': [0, 1]
          },
          {
            'type': 'update',
            'fromNode': { 'type': 'button', 'key': 't' },
            'afterNode': { 'type': 'button', 'key': 't' },
            'parentNode': { 'type': 'div' },
            'fromPath': [0, 3]
          },
          {
            'type': 'update',
            'fromNode': { 'type': 'div' },
            'afterNode': { 'type': 'div' },
            'fromPath': [0]
          }
        ],
        'removeQueue': [
          {
            'type': 'move',
            'fromNode': { 'type': 'p', 'key': '1' },
            'afterNode': { 'type': 'p', 'key': '1' },
            'parentNode': { 'type': 'div' },
            'fromPath': [0, 1],
            'toPath': [0, 2]
          }
        ]
      }
    );
  });
});
