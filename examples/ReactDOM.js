/* eslint no-console:0 */

import React from 'react';
import ReactDOM from 'react-dom';

const Wrap = React.createClass({
  propTypes: {
    component: React.PropTypes.node,
  },
  componentDidMount() {
    console.log('componentDidMount', this.props.component);
  },
  componentWillUnmount() {
    console.log('componentWillUnmount', this.props.component);
  },
  render() {
    return this.props.component;
  },
});

const vdom1 = (<div>
  <Wrap component={<p id="1">1</p>}/>
  <Wrap component={<p id="2">2</p>}/>
  <Wrap component={<button id="t">change</button>}/>
</div>);

ReactDOM.render(vdom1, document.getElementById('__react-content'));

document.getElementById('t').onclick = () => {
  ReactDOM.render(<div>
    <Wrap component={<p id="2">2</p>}/>
    <Wrap component={<p id="1">1</p>}/>
    <Wrap component={<p id="3">3</p>}/>
    <Wrap component={<button id="t">change</button>}/>
  </div>, document.getElementById('__react-content'));
};
