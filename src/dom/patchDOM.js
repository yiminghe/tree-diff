import patch from '../patch';
import createDOMNode from './createDOMNode';

function findNodeByPath(root, fromPath) {
  let parent = root;
  const node = fromPath.reduce(
      (n, p) => {
        parent = n;
        return n.childNodes[p];
      },
      root) || null;
  return {
    node,
    parent,
  };
}

function processNew(root, q) {
  const { afterNode, toPath } = q;
  const newNode = createDOMNode(afterNode);
  const { parent, node } = findNodeByPath(root, toPath);
  parent.insertBefore(newNode, node);
}

function processMove(_, q, { parent, node }) {
  const { toPath } = q;
  parent.insertBefore(node, parent.childNodes[toPath[toPath.length - 1]] || null);
}

function processRemove(root, q) {
  const { fromPath } = q;
  const { parent, node } = findNodeByPath(root, fromPath);
  parent.removeChild(node);
  return { parent, node };
}

function processUpdate(root, q) {
  const { fromPath, fromNode, afterNode } = q;
  const { node } = findNodeByPath(root, fromPath);
  if (typeof afterNode === 'string') {
    if (afterNode !== fromNode) {
      node.nodeValue = afterNode;
    }
    return;
  }
  const currentProps = fromNode.props;
  const nextProps = afterNode.props;
  for (const nextName in nextProps) {
    if (nextProps.hasOwnProperty(nextName)) {
      const nextValue = nextProps[nextName];
      const currentValue = currentProps[nextName];
      if (nextValue !== currentValue) {
        node.setAttribute(nextName, nextValue);
      }
    }
  }
  for (const currentName in currentProps) {
    if (currentProps.hasOwnProperty(currentName) && !nextProps.hasOwnProperty(currentName)) {
      node.removeAttribute(currentName);
    }
  }
}

function patchDOM(queue, root) {
  patch(queue, {
    processNew: processNew.bind(null, root),
    processMove: processMove.bind(null, root),
    processUpdate: processUpdate.bind(null, root),
    processRemove: processRemove.bind(null, root),
  });
}

export default patchDOM;
