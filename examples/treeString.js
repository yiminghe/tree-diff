/* eslint no-console:0 */

import { diff, patch } from 'tree-diff';

const a = [{ value: '1' }, { value: '2', children: ['1', '2', '3'] }, { value: '3' }];
const b = [{ value: '4' }, { value: '3' }, { value: '1' },
  { value: '2', children: ['4', '3', '1', '2'] }];

const operations = diff(a, b, {
  shouldUpdate(v1, v2) {
    if (v1.value && v2.value) {
      return v1.value === v2.value;
    }
    return v1 === v2;
  },
});

console.log('operations', operations);

function getArray(q, ensure = true) {
  let array;
  if (q.parentNode) {
    array = q.parentNode.children;
    if (ensure) {
      array = q.parentNode.children = q.parentNode.children || [];
    }
  } else {
    array = a;
  }
  return array;
}

patch(operations, {
  processNew(q) {
    getArray(q).splice(q.toPath[q.toPath.length - 1], 0, q.nextNode);
  },
  processRemove(q) {
    const arr = getArray(q);
    const r = arr[q.path[q.path.length - 1]];
    arr.splice(q.path[q.path.length - 1], 1);
    return r;
  },
  processUpdate() {
  },
  processMove(q, r) {
    getArray(q).splice(q.toPath[q.toPath.length - 1], 0, r);
  },
});

console.log(a, b);
