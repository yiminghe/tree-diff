/* eslint quotes:0, quote-props:0, comma-dangle:0 */

import expect from 'expect.js';
import { diff, patch } from 'tree-diff';

describe('array-diff', () => {
  it('works for array', () => {
    const a = ['1', '2', '3'];
    const b = ['4', '3', '1', '2'];

    const operations = diff(a, b, { childrenKey: '' });

    expect(JSON.parse(JSON.stringify(operations))).to.eql(
      {
        'insertQueue': [
          { 'type': 'new', 'nextNode': '4', 'toPath': [0] },
          {
            'type': 'move',
            'currentNode': '1',
            'nextNode': '1',
            'currentIndex': 0,
            'path': [0],
            'toPath': [2]
          },
          {
            'type': 'move',
            'currentNode': '2',
            'nextNode': '2',
            'currentIndex': 1,
            'path': [1],
            'toPath': [3]
          }
        ],
        'updateQueue': [
          {
            'type': 'update',
            'currentNode': '3',
            'nextNode': '3',
            'path': [2]
          },
          {
            'type': 'update',
            'currentNode': '1',
            'nextNode': '1',
            'path': [0]
          },
          {
            'type': 'update',
            'currentNode': '2',
            'nextNode': '2',
            'path': [1]
          }
        ],
        'removeQueue': [
          {
            'type': 'move',
            'currentNode': '2',
            'nextNode': '2',
            'currentIndex': 1,
            'path': [1],
            'toPath': [3]
          },
          {
            'type': 'move',
            'currentNode': '1',
            'nextNode': '1',
            'currentIndex': 0,
            'path': [0],
            'toPath': [2]
          }
        ]
      }
    );

    patch(operations, {
      processNew(q) {
        a.splice(q.toPath[0], 0, q.nextNode);
      },
      processRemove(q) {
        const r = a[q.path[0]];
        a.splice(q.path[0], 1);
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
