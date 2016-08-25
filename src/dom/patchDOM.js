import patch from '../patch';
import createDOMNode from './createDOMNode';

function findNodeByPath(root, path) {
  let parent = root;
  const node = path.reduce(
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
  const { nextNode, toPath } = q;
  const newNode = createDOMNode(nextNode);
  const { parent, node } = findNodeByPath(root, toPath);
  parent.insertBefore(newNode, node);
}

function processMove(_, q, { parent, node }) {
  const { toPath } = q;
  parent.insertBefore(node, parent.childNodes[toPath[toPath.length - 1]] || null);
}

function processRemove(root, q) {
  const { path } = q;
  const { parent, node } = findNodeByPath(root, path);
  parent.removeChild(node);
  return { parent, node };
}

function processUpdate(root, q) {
  const { path, currentNode, nextNode } = q;
  const { node } = findNodeByPath(root, path);
  if (typeof nextNode === 'string') {
    if (nextNode !== currentNode) {
      node.nodeValue = nextNode;
    }
    return;
  }
  const currentProps = currentNode.props;
  const nextProps = nextNode.props;
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
