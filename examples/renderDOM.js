webpackJsonp([2,4],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(179);


/***/ },

/***/ 176:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = diffTree;
	
	var _ChildOperationTypes = __webpack_require__(177);
	
	function indexOf(nodes, node, isSame, nodeIndex) {
	  var len = nodes.length;
	  for (var i = 0; i < len; i++) {
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
	function diff(fromNodes, afterNodes) {
	  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
	  var internal = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];
	  var _options$shouldUpdate = options.shouldUpdate;
	  var shouldUpdate = _options$shouldUpdate === undefined ? nativeShould : _options$shouldUpdate;
	  var _options$childrenKey = options.childrenKey;
	  var childrenKey = _options$childrenKey === undefined ? 'children' : _options$childrenKey;
	  var _internal$fromPath = internal.fromPath;
	  var fromPath = _internal$fromPath === undefined ? [] : _internal$fromPath;
	  var parentNode = internal.parentNode;
	
	  var insertQueue = [];
	  var updateQueue = [];
	  var removeQueue = [];
	  var lastIndex = 0;
	  var tmp = void 0;
	  afterNodes.forEach(function (afterNode, toIndex) {
	    var fromIndex = indexOf(fromNodes, afterNode, shouldUpdate, toIndex);
	    if (fromIndex !== -1) {
	      var fromNode = fromNodes[fromIndex];
	      updateQueue.push({
	        type: _ChildOperationTypes.UPDATE,
	        fromNode: fromNode,
	        afterNode: afterNode,
	        parentNode: parentNode,
	        fromIndex: fromIndex,
	        fromPath: fromPath.concat(fromIndex)
	      });
	      if (fromIndex < lastIndex) {
	        tmp = {
	          type: _ChildOperationTypes.MOVE,
	          fromNode: fromNode,
	          afterNode: afterNode,
	          parentNode: parentNode,
	          fromIndex: fromIndex,
	          toIndex: toIndex,
	          fromPath: fromPath.concat(fromIndex),
	          toPath: fromPath.concat(toIndex)
	        };
	        insertQueue.push(tmp);
	        removeQueue.push(tmp);
	      }
	      lastIndex = Math.max(fromIndex, lastIndex);
	    } else {
	      insertQueue.push({
	        type: _ChildOperationTypes.NEW,
	        afterNode: afterNode,
	        parentNode: parentNode,
	        toIndex: toIndex,
	        toPath: fromPath.concat(toIndex)
	      });
	    }
	  });
	
	  fromNodes.forEach(function (fromNode, fromIndex) {
	    var toIndex = indexOf(afterNodes, fromNode, shouldUpdate, fromIndex);
	    if (toIndex === -1) {
	      removeQueue.push({
	        type: _ChildOperationTypes.REMOVE,
	        fromNode: fromNode,
	        parentNode: parentNode,
	        fromIndex: fromIndex,
	        fromPath: fromPath.concat(fromIndex)
	      });
	    }
	  });
	
	  removeQueue.sort(sortByIndex);
	
	  if (childrenKey) {
	    updateQueue.concat().forEach(function (o) {
	      var currentChildren = o.fromNode[childrenKey] || [];
	      var nextChildren = o.afterNode[childrenKey] || [];
	      // bottom up
	      var ret = diff(currentChildren, nextChildren, options, {
	        fromPath: o.fromPath,
	        parentNode: o.fromNode
	      });
	      insertQueue = ret.insertQueue.concat(insertQueue);
	      updateQueue = ret.updateQueue.concat(updateQueue);
	      removeQueue = ret.removeQueue.concat(removeQueue);
	    });
	  }
	
	  return {
	    insertQueue: insertQueue,
	    updateQueue: updateQueue,
	    removeQueue: removeQueue
	  };
	}
	
	function diffTree(fromNodes, afterNodes, options) {
	  return diff(fromNodes, afterNodes, options);
	}
	module.exports = exports['default'];

/***/ },

/***/ 177:
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var MOVE = exports.MOVE = 'move';
	var UPDATE = exports.UPDATE = 'update';
	var REMOVE = exports.REMOVE = 'remove';
	var NEW = exports.NEW = 'new';

/***/ },

/***/ 178:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _ChildOperationTypes = __webpack_require__(177);
	
	function patch(_ref, _ref2) {
	  var removeQueue = _ref.removeQueue;
	  var insertQueue = _ref.insertQueue;
	  var updateQueue = _ref.updateQueue;
	  var processNew = _ref2.processNew;
	  var processUpdate = _ref2.processUpdate;
	  var processMove = _ref2.processMove;
	  var processRemove = _ref2.processRemove;
	
	  updateQueue.forEach(function (q) {
	    processUpdate(q);
	  });
	
	  var moves = {};
	
	  removeQueue.forEach(function (q) {
	    var ret = processRemove(q);
	    if (q.type === _ChildOperationTypes.MOVE) {
	      moves[q.toPath.join(',')] = ret;
	    }
	  });
	
	  insertQueue.forEach(function (q) {
	    if (q.type === _ChildOperationTypes.NEW) {
	      processNew(q);
	    } else if (q.type === _ChildOperationTypes.MOVE) {
	      processMove(q, moves[q.toPath.join(',')]);
	    }
	  });
	}
	
	exports.default = patch;
	module.exports = exports['default'];

/***/ },

/***/ 179:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _dom = __webpack_require__(180);
	
	function simplifyOperations(operations) {
	  return JSON.parse(JSON.stringify(operations, function (k, v) {
	    return k === 'children' || k === 'props' ? undefined : v;
	  }));
	} /** @jsx dom */
	
	/* eslint no-console:0 */
	
	(function () {
	  var vdom1 = (0, _dom.dom)(
	    'div',
	    null,
	    (0, _dom.dom)(
	      'h2',
	      null,
	      'no key'
	    ),
	    (0, _dom.dom)(
	      'p',
	      { id: '1' },
	      '1'
	    ),
	    (0, _dom.dom)(
	      'p',
	      { id: '2' },
	      '2'
	    ),
	    (0, _dom.dom)(
	      'button',
	      { id: 't' },
	      'change'
	    )
	  );
	  var container = document.createElement('div');
	  document.getElementById('__react-content').appendChild(container);
	
	  var _renderDOM = (0, _dom.renderDOM)(vdom1, container);
	
	  var update = _renderDOM.update;
	
	
	  document.getElementById('t').onclick = function () {
	    var operations = update((0, _dom.dom)(
	      'div',
	      null,
	      (0, _dom.dom)(
	        'h2',
	        null,
	        'no key'
	      ),
	      (0, _dom.dom)(
	        'p',
	        { id: '2' },
	        '2'
	      ),
	      (0, _dom.dom)(
	        'p',
	        { id: '1' },
	        '1'
	      ),
	      (0, _dom.dom)(
	        'p',
	        { id: '3' },
	        '3'
	      ),
	      (0, _dom.dom)(
	        'button',
	        { id: 't' },
	        'change'
	      )
	    ));
	    console.log('operations', simplifyOperations(operations));
	  };
	})();
	
	(function () {
	  var vdom1 = (0, _dom.dom)(
	    'div',
	    null,
	    (0, _dom.dom)(
	      'h2',
	      null,
	      'with key'
	    ),
	    (0, _dom.dom)(
	      'p',
	      { key: '1' },
	      '1'
	    ),
	    (0, _dom.dom)(
	      'p',
	      { key: '2' },
	      '2'
	    ),
	    (0, _dom.dom)(
	      'button',
	      { key: 't', id: 't2' },
	      'change'
	    )
	  );
	  var container = document.createElement('div');
	  document.getElementById('__react-content').appendChild(container);
	
	  var _renderDOM2 = (0, _dom.renderDOM)(vdom1, container);
	
	  var update = _renderDOM2.update;
	
	
	  document.getElementById('t2').onclick = function () {
	    var operations = update((0, _dom.dom)(
	      'div',
	      null,
	      (0, _dom.dom)(
	        'h2',
	        null,
	        'with key'
	      ),
	      (0, _dom.dom)(
	        'p',
	        { key: '2' },
	        '2'
	      ),
	      (0, _dom.dom)(
	        'p',
	        { key: '1' },
	        '1'
	      ),
	      (0, _dom.dom)(
	        'p',
	        { key: '3' },
	        '3'
	      ),
	      (0, _dom.dom)(
	        'button',
	        { key: 't', id: 't' },
	        'change'
	      )
	    ));
	
	    console.log('operations', simplifyOperations(operations));
	  };
	})();

/***/ },

/***/ 180:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _dom = __webpack_require__(181);
	
	Object.defineProperty(exports, 'dom', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_dom).default;
	  }
	});
	
	var _renderDOM = __webpack_require__(182);
	
	Object.defineProperty(exports, 'renderDOM', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_renderDOM).default;
	  }
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },

/***/ 181:
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = dom;
	function dom(type, props) {
	  for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
	    children[_key - 2] = arguments[_key];
	  }
	
	  var ret = {
	    type: type,
	    props: props,
	    children: children
	  };
	  if (props && props.key) {
	    ret.key = props.key;
	    delete props.key;
	  }
	  return ret;
	}
	module.exports = exports['default'];

/***/ },

/***/ 182:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var _diff = __webpack_require__(176);
	
	var _diff2 = _interopRequireDefault(_diff);
	
	var _createDOMNode = __webpack_require__(183);
	
	var _createDOMNode2 = _interopRequireDefault(_createDOMNode);
	
	var _patchDOM = __webpack_require__(184);
	
	var _patchDOM2 = _interopRequireDefault(_patchDOM);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function getDefaultKeyFromIndex(index) {
	  return '.' + index;
	}
	
	function shouldUpdate(prevElement, nextElement, prevElementIndex, nextElementIndex) {
	  var prevEmpty = prevElement === null || prevElement === false;
	  var nextEmpty = nextElement === null || nextElement === false;
	  if (prevEmpty || nextEmpty) {
	    return prevEmpty === nextEmpty;
	  }
	
	  var prevType = typeof prevElement === 'undefined' ? 'undefined' : _typeof(prevElement);
	  var nextType = typeof nextElement === 'undefined' ? 'undefined' : _typeof(nextElement);
	  if (prevType === 'string' || prevType === 'number') {
	    return nextType === 'string' || nextType === 'number';
	  }
	  return nextType === 'object' && prevElement.type === nextElement.type && (prevElement.key || getDefaultKeyFromIndex(prevElementIndex)) === (nextElement.key || getDefaultKeyFromIndex(nextElementIndex));
	}
	
	function renderDOM(vdom_, root) {
	  var vdom = vdom_;
	  if (!Array.isArray(vdom_)) {
	    vdom = [vdom_];
	  }
	  vdom.forEach(function (n) {
	    var c = (0, _createDOMNode2.default)(n);
	    root.appendChild(c);
	  });
	  var currentVDom = vdom;
	  return {
	    update: function update(nextVDom_) {
	      var nextVDom = nextVDom_;
	      if (!Array.isArray(nextVDom)) {
	        nextVDom = [nextVDom];
	      }
	      var queue = (0, _diff2.default)(currentVDom, nextVDom, { shouldUpdate: shouldUpdate });
	      currentVDom = nextVDom;
	      (0, _patchDOM2.default)(queue, root);
	      return queue;
	    }
	  };
	}
	
	exports.default = renderDOM;
	module.exports = exports['default'];

/***/ },

/***/ 183:
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	function createDOMNode(vdom) {
	  var doc = arguments.length <= 1 || arguments[1] === undefined ? document : arguments[1];
	
	  if (typeof vdom === 'string') {
	    return doc.createTextNode(vdom);
	  }
	  var type = vdom.type;
	  var props = vdom.props;
	
	  var node = doc.createElement(type);
	  for (var name in props) {
	    if (props.hasOwnProperty(name)) {
	      node.setAttribute(name, props[name]);
	    }
	  }
	  if (vdom.children) {
	    vdom.children.forEach(function (c) {
	      var child = createDOMNode(c, doc);
	      node.appendChild(child);
	    });
	  }
	  return node;
	}
	
	exports.default = createDOMNode;
	module.exports = exports['default'];

/***/ },

/***/ 184:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _patch = __webpack_require__(178);
	
	var _patch2 = _interopRequireDefault(_patch);
	
	var _createDOMNode = __webpack_require__(183);
	
	var _createDOMNode2 = _interopRequireDefault(_createDOMNode);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function findNodeByPath(root, fromPath) {
	  var parent = root;
	  var node = fromPath.reduce(function (n, p) {
	    parent = n;
	    return n.childNodes[p];
	  }, root) || null;
	  return {
	    node: node,
	    parent: parent
	  };
	}
	
	function processNew(root, q) {
	  var afterNode = q.afterNode;
	  var toPath = q.toPath;
	
	  var newNode = (0, _createDOMNode2.default)(afterNode);
	
	  var _findNodeByPath = findNodeByPath(root, toPath);
	
	  var parent = _findNodeByPath.parent;
	  var node = _findNodeByPath.node;
	
	  parent.insertBefore(newNode, node);
	}
	
	function processMove(_, q, _ref) {
	  var parent = _ref.parent;
	  var node = _ref.node;
	  var toPath = q.toPath;
	
	  parent.insertBefore(node, parent.childNodes[toPath[toPath.length - 1]] || null);
	}
	
	function processRemove(root, q) {
	  var fromPath = q.fromPath;
	
	  var _findNodeByPath2 = findNodeByPath(root, fromPath);
	
	  var parent = _findNodeByPath2.parent;
	  var node = _findNodeByPath2.node;
	
	  parent.removeChild(node);
	  return { parent: parent, node: node };
	}
	
	function processUpdate(root, q) {
	  var fromPath = q.fromPath;
	  var fromNode = q.fromNode;
	  var afterNode = q.afterNode;
	
	  var _findNodeByPath3 = findNodeByPath(root, fromPath);
	
	  var node = _findNodeByPath3.node;
	
	  if (typeof afterNode === 'string') {
	    if (afterNode !== fromNode) {
	      node.nodeValue = afterNode;
	    }
	    return;
	  }
	  var currentProps = fromNode.props;
	  var nextProps = afterNode.props;
	  for (var nextName in nextProps) {
	    if (nextProps.hasOwnProperty(nextName)) {
	      var nextValue = nextProps[nextName];
	      var currentValue = currentProps[nextName];
	      if (nextValue !== currentValue) {
	        node.setAttribute(nextName, nextValue);
	      }
	    }
	  }
	  for (var currentName in currentProps) {
	    if (currentProps.hasOwnProperty(currentName) && !nextProps.hasOwnProperty(currentName)) {
	      node.removeAttribute(currentName);
	    }
	  }
	}
	
	function patchDOM(queue, root) {
	  (0, _patch2.default)(queue, {
	    processNew: processNew.bind(null, root),
	    processMove: processMove.bind(null, root),
	    processUpdate: processUpdate.bind(null, root),
	    processRemove: processRemove.bind(null, root)
	  });
	}
	
	exports.default = patchDOM;
	module.exports = exports['default'];

/***/ }

});
//# sourceMappingURL=renderDOM.js.map