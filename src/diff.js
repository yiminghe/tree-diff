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
  if (a.currentIndex === b.currentIndex) {
    return 0;
  }
  return a.currentIndex > b.currentIndex ? -1 : 1;
}

// diff by level
function diff(currentNodes, nextNodes, options = {}, internal = {}) {
  const { shouldUpdate = nativeShould, childrenKey = 'children' } = options;
  const { path = [], parentNode } = internal;
  let insertQueue = [];
  let updateQueue = [];
  let removeQueue = [];
  let lastIndex = 0;
  let tmp;
  nextNodes.forEach((nextNode, nextIndex) => {
    const currentIndex = indexOf(currentNodes, nextNode, shouldUpdate, nextIndex);
    if (currentIndex !== -1) {
      const currentNode = currentNodes[currentIndex];
      updateQueue.push({
        type: 'update',
        currentNode,
        nextNode,
        parentNode,
        path: path.concat(currentIndex),
      });
      if (currentIndex < lastIndex) {
        tmp = {
          type: 'move',
          currentNode,
          nextNode,
          parentNode,
          currentIndex,
          path: path.concat(currentIndex),
          toPath: path.concat(nextIndex),
        };
        insertQueue.push(tmp);
        removeQueue.push(tmp);
      }
      lastIndex = Math.max(currentIndex, lastIndex);
    } else {
      insertQueue.push({
        type: 'new',
        nextNode,
        parentNode,
        toPath: path.concat(nextIndex),
      });
    }
  });

  currentNodes.forEach((currentNode, currentIndex) => {
    const nextIndex = indexOf(nextNodes, currentNode, shouldUpdate, currentIndex);
    if (nextIndex === -1) {
      removeQueue.push({
        type: 'remove',
        currentNode,
        parentNode,
        currentIndex,
        path: path.concat(currentIndex),
      });
    }
  });

  removeQueue.sort(sortByIndex);

  if (childrenKey) {
    updateQueue.concat().forEach((o) => {
      const currentChildren = o.currentNode[childrenKey] || [];
      const nextChildren = o.nextNode[childrenKey] || [];
      // bottom up
      const ret = diff(currentChildren, nextChildren, options, {
        path: o.path,
        parentNode: o.currentNode,
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

export default function diffTree(currentNodes, nextNodes, options) {
  return diff(currentNodes, nextNodes, options);
}
