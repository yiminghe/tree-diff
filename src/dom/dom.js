export default function dom(type, props, ...children) {
  const ret = {
    type,
    props,
    children,
  };
  if (props && props.key) {
    ret.key = props.key;
    delete props.key;
  }
  return ret;
}
