/* eslint quotes:0, quote-props:0, comma-dangle:0 */

import expect from 'expect.js';
import { diff, patch } from 'tree-diff';

describe('array-diff', () => {
  function simplifyOperations(operations) {
    return JSON.parse(JSON.stringify(operations, (k, v) => {
      return k === 'children' || k === 'props' ||
      k === 'fromIndex' || k === 'toIndex' ? undefined : v;
    }));
  }


  it('works for array', () => {
    const a = ['1', '2', '3'];
    const b = ['4', '3', '1', '2'];

    const operations = diff(a, b);

    expect(simplifyOperations(operations)).to.eql(
      {
        'insertQueue': [
          { 'type': 'new', 'afterNode': '4', 'toPath': [0] },
          {
            'type': 'move',
            'fromNode': '1',
            'afterNode': '1',
            'fromPath': [0],
            'toPath': [2]
          },
          {
            'type': 'move',
            'fromNode': '2',
            'afterNode': '2',
            'fromPath': [1],
            'toPath': [3]
          }
        ],
        'updateQueue': [
          {
            'type': 'update',
            'fromNode': '3',
            'afterNode': '3',
            'fromPath': [2]
          },
          {
            'type': 'update',
            'fromNode': '1',
            'afterNode': '1',
            'fromPath': [0]
          },
          {
            'type': 'update',
            'fromNode': '2',
            'afterNode': '2',
            'fromPath': [1]
          }
        ],
        'removeQueue': [
          {
            'type': 'move',
            'fromNode': '2',
            'afterNode': '2',
            'fromPath': [1],
            'toPath': [3]
          },
          {
            'type': 'move',
            'fromNode': '1',
            'afterNode': '1',
            'fromPath': [0],
            'toPath': [2]
          }
        ]
      }
    );

    patch(operations, {
      processNew(q) {
        a.splice(q.toPath[0], 0, q.afterNode);
      },
      processRemove(q) {
        const r = a[q.fromPath[0]];
        a.splice(q.fromPath[0], 1);
        return r;
      },
      processUpdate() {
      },
      processMove(q, r) {
        a.splice(q.toPath[0], 0, r);
      }
    });

    expect(a).to.eql(b);
  });
});
