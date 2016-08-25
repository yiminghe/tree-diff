/* eslint no-console:0 */

import { diff, patch } from 'tree-diff';

const a = ['1', '2', '3'];
const b = ['4', '3', '1', '2'];

const operations = diff(a, b, { childrenKey: '' });

console.log('operations', operations);

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
  },
});

console.log(a, b);
