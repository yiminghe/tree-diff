function createDOMNode(vdom, doc = document) {
  if (typeof vdom === 'string') {
    return doc.createTextNode(vdom);
  }
  const { type, props } = vdom;
  const node = doc.createElement(type);
  for (const name in props) {
    if (props.hasOwnProperty(name)) {
      node.setAttribute(name, props[name]);
    }
  }
  if (vdom.children) {
    vdom.children.forEach((c) => {
      const child = createDOMNode(c, doc);
      node.appendChild(child);
    });
  }
  return node;
}

export default createDOMNode;
