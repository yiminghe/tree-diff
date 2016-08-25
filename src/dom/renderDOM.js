import diff from '../diff';
import createDOMNode from './createDOMNode';
import patchDOM from './patchDOM';

function getDefaultKeyFromIndex(index) {
  return `.${index}`;
}

function shouldUpdate(prevElement, nextElement, prevElementIndex, nextElementIndex) {
  const prevEmpty = prevElement === null || prevElement === false;
  const nextEmpty = nextElement === null || nextElement === false;
  if (prevEmpty || nextEmpty) {
    return prevEmpty === nextEmpty;
  }

  const prevType = typeof prevElement;
  const nextType = typeof nextElement;
  if (prevType === 'string' || prevType === 'number') {
    return (nextType === 'string' || nextType === 'number');
  }
  return (
    nextType === 'object' &&
    prevElement.type === nextElement.type &&
    (prevElement.key || getDefaultKeyFromIndex(prevElementIndex))
    === (nextElement.key || getDefaultKeyFromIndex(nextElementIndex))
  );
}

function renderDOM(vdom_, root) {
  let vdom = vdom_;
  if (!Array.isArray(vdom_)) {
    vdom = [vdom_];
  }
  vdom.forEach((n) => {
    const c = createDOMNode(n);
    root.appendChild(c);
  });
  let currentVDom = vdom;
  return {
    update(nextVDom_) {
      let nextVDom = nextVDom_;
      if (!Array.isArray(nextVDom)) {
        nextVDom = [nextVDom];
      }
      const queue = diff(currentVDom, nextVDom, { shouldUpdate });
      currentVDom = nextVDom;
      patchDOM(queue, root);
      return queue;
    },
  };
}

export default renderDOM;
