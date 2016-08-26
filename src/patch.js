import { MOVE, NEW } from './ChildOperationTypes';

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
    if (q.type === MOVE) {
      moves[q.toPath.join(',')] = ret;
    }
  });

  insertQueue.forEach((q) => {
    if (q.type === NEW) {
      processNew(q);
    } else if (q.type === MOVE) {
      processMove(q, moves[q.toPath.join(',')]);
    }
  });
}

export default patch;
