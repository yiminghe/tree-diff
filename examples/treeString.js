webpackJsonp([3,4],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(185);


/***/ },

/***/ 174:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = __webpack_require__(175);

/***/ },

/***/ 175:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _diff = __webpack_require__(176);
	
	Object.defineProperty(exports, 'diff', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_diff).default;
	  }
	});
	
	var _patch = __webpack_require__(178);
	
	Object.defineProperty(exports, 'patch', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_patch).default;
	  }
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

/***/ 185:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _treeDiff = __webpack_require__(174);
	
	var a = [{ value: '1' }, { value: '2', children: ['1', '2', '3'] }, { value: '3' }]; /* eslint no-console:0 */
	
	var b = [{ value: '4' }, { value: '3' }, { value: '1' }, { value: '2', children: ['4', '3', '1', '2'] }];
	
	var operations = (0, _treeDiff.diff)(a, b, {
	  shouldUpdate: function shouldUpdate(v1, v2) {
	    if (v1.value && v2.value) {
	      return v1.value === v2.value;
	    }
	    return v1 === v2;
	  }
	});
	
	console.log('operations', operations);
	
	function getArray(q) {
	  var ensure = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];
	
	  var array = void 0;
	  if (q.parentNode) {
	    array = q.parentNode.children;
	    if (ensure) {
	      array = q.parentNode.children = q.parentNode.children || [];
	    }
	  } else {
	    array = a;
	  }
	  return array;
	}
	
	(0, _treeDiff.patch)(operations, {
	  processNew: function processNew(q) {
	    getArray(q).splice(q.toIndex, 0, q.afterNode);
	  },
	  processRemove: function processRemove(q) {
	    var arr = getArray(q);
	    var r = arr[q.fromIndex];
	    arr.splice(q.fromIndex, 1);
	    return r;
	  },
	  processUpdate: function processUpdate() {},
	  processMove: function processMove(q, r) {
	    getArray(q).splice(q.toIndex, 0, r);
	  }
	});
	
	console.log(a, b);

/***/ }

});
//# sourceMappingURL=treeString.js.map