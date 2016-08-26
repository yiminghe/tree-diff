import { UPDATE, MOVE, REMOVE, NEW } from './ChildOperationTypes';

function indexOf(nodes, node, isSame, nodeIndex) {
  const len = nodes.length;
  for (let i = 0; i < len; i++) {
    if (isSame(node, nodes[i], nodeIndex, i)) {
      return i;
    }
  }
  return -1;
}

function nativeShould(a, b) {
  return a === b;
}

function sortByIndex(a, b) {
  if (a.fromIndex === b.fromIndex) {
    return 0;
  }
  return a.fromIndex > b.fromIndex ? -1 : 1;
}

// diff by level
function diff(fromNodes, afterNodes, options = {}, internal = {}) {
  const { shouldUpdate = nativeShould, childrenKey = 'children' } = options;
  const { fromPath = [], parentNode } = internal;
  let insertQueue = [];
  let updateQueue = [];
  let removeQueue = [];
  let lastIndex = 0;
  let tmp;
  afterNodes.forEach((afterNode, toIndex) => {
    const fromIndex = indexOf(fromNodes, afterNode, shouldUpdate, toIndex);
    if (fromIndex !== -1) {
      const fromNode = fromNodes[fromIndex];
      updateQueue.push({
        type: UPDATE,
        fromNode,
        afterNode,
        parentNode,
        fromIndex,
        fromPath: fromPath.concat(fromIndex),
      });
      if (fromIndex < lastIndex) {
        tmp = {
          type: MOVE,
          fromNode,
          afterNode,
          parentNode,
          fromIndex,
          toIndex,
          fromPath: fromPath.concat(fromIndex),
          toPath: fromPath.concat(toIndex),
        };
        insertQueue.push(tmp);
        removeQueue.push(tmp);
      }
      lastIndex = Math.max(fromIndex, lastIndex);
    } else {
      insertQueue.push({
        type: NEW,
        afterNode,
        parentNode,
        toIndex,
        toPath: fromPath.concat(toIndex),
      });
    }
  });

  fromNodes.forEach((fromNode, fromIndex) => {
    const toIndex = indexOf(afterNodes, fromNode, shouldUpdate, fromIndex);
    if (toIndex === -1) {
      removeQueue.push({
        type: REMOVE,
        fromNode,
        parentNode,
        fromIndex,
        fromPath: fromPath.concat(fromIndex),
      });
    }
  });

  removeQueue.sort(sortByIndex);

  if (childrenKey) {
    updateQueue.concat().forEach((o) => {
      const currentChildren = o.fromNode[childrenKey] || [];
      const nextChildren = o.afterNode[childrenKey] || [];
      // bottom up
      const ret = diff(currentChildren, nextChildren, options, {
        fromPath: o.fromPath,
        parentNode: o.fromNode,
      });
      insertQueue = ret.insertQueue.concat(insertQueue);
      updateQueue = ret.updateQueue.concat(updateQueue);
      removeQueue = ret.removeQueue.concat(removeQueue);
    });
  }

  return {
    insertQueue,
    updateQueue,
    removeQueue,
  };
}

export default function diffTree(fromNodes, afterNodes, options) {
  return diff(fromNodes, afterNodes, options);
}
