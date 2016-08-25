function patch({ removeQueue, insertQueue, updateQueue }, {
  processNew,
  processUpdate,
  processMove,
  processRemove,
}) {
  updateQueue.forEach((q) => {
    processUpdate(q);
  });

  const moves = {};

  removeQueue.forEach((q) => {
    const ret = processRemove(q);
    if (q.type === 'move') {
      moves[q.toPath.join(',')] = ret;
    }
  });

  insertQueue.forEach((q) => {
    if (q.type === 'new') {
      processNew(q);
    } else if (q.type === 'move') {
      processMove(q, moves[q.toPath.join(',')]);
    }
  });
}

export default patch;
