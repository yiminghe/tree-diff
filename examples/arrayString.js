/* eslint no-console:0 */

import { diff, patch } from 'tree-diff';

const a = ['1', '2', '3'];
const b = ['4', '3', '1', '2'];

const operations = diff(a, b);

console.log('operations', operations);

patch(operations, {
  processNew(q) {
    a.splice(q.toIndex, 0, q.afterNode);
  },
  processRemove(q) {
    const r = a[q.fromIndex];
    a.splice(q.fromIndex, 1);
    return r;
  },
  processUpdate() {
  },
  processMove(q, r) {
    a.splice(q.toIndex, 0, r);
  },
});

console.log(a, b);
