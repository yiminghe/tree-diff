webpackJsonp([1,3],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(173);


/***/ },

/***/ 173:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _treeDiff = __webpack_require__(174);
	
	var a = ['1', '2', '3']; /* eslint no-console:0 */
	
	var b = ['4', '3', '1', '2'];
	
	var operations = (0, _treeDiff.diff)(a, b, { childrenKey: '' });
	
	console.log('operations', operations);
	
	(0, _treeDiff.patch)(operations, {
	  processNew: function processNew(q) {
	    a.splice(q.toPath[0], 0, q.nextNode);
	  },
	  processRemove: function processRemove(q) {
	    var r = a[q.path[0]];
	    a.splice(q.path[0], 1);
	    return r;
	  },
	  processUpdate: function processUpdate() {},
	  processMove: function processMove(q, r) {
	    a.splice(q.toPath[0], 0, r);
	  }
	});
	
	console.log(a, b);

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
	
	var _patch = __webpack_require__(177);
	
	Object.defineProperty(exports, 'patch', {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_patch).default;
	  }
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },

/***/ 176:
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = diffTree;
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
	  if (a.currentIndex === b.currentIndex) {
	    return 0;
	  }
	  return a.currentIndex > b.currentIndex ? -1 : 1;
	}
	
	// diff by level
	function diff(currentNodes, nextNodes) {
	  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
	  var internal = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];
	  var _options$shouldUpdate = options.shouldUpdate;
	  var shouldUpdate = _options$shouldUpdate === undefined ? nativeShould : _options$shouldUpdate;
	  var _options$childrenKey = options.childrenKey;
	  var childrenKey = _options$childrenKey === undefined ? 'children' : _options$childrenKey;
	  var _internal$path = internal.path;
	  var path = _internal$path === undefined ? [] : _internal$path;
	  var parentNode = internal.parentNode;
	
	  var insertQueue = [];
	  var updateQueue = [];
	  var removeQueue = [];
	  var lastIndex = 0;
	  var tmp = void 0;
	  nextNodes.forEach(function (nextNode, nextIndex) {
	    var currentIndex = indexOf(currentNodes, nextNode, shouldUpdate, nextIndex);
	    if (currentIndex !== -1) {
	      var currentNode = currentNodes[currentIndex];
	      updateQueue.push({
	        type: 'update',
	        currentNode: currentNode,
	        nextNode: nextNode,
	        parentNode: parentNode,
	        path: path.concat(currentIndex)
	      });
	      if (currentIndex < lastIndex) {
	        tmp = {
	          type: 'move',
	          currentNode: currentNode,
	          nextNode: nextNode,
	          parentNode: parentNode,
	          currentIndex: currentIndex,
	          path: path.concat(currentIndex),
	          toPath: path.concat(nextIndex)
	        };
	        insertQueue.push(tmp);
	        removeQueue.push(tmp);
	      }
	      lastIndex = Math.max(currentIndex, lastIndex);
	    } else {
	      insertQueue.push({
	        type: 'new',
	        nextNode: nextNode,
	        parentNode: parentNode,
	        toPath: path.concat(nextIndex)
	      });
	    }
	  });
	
	  currentNodes.forEach(function (currentNode, currentIndex) {
	    var nextIndex = indexOf(nextNodes, currentNode, shouldUpdate, currentIndex);
	    if (nextIndex === -1) {
	      removeQueue.push({
	        type: 'remove',
	        currentNode: currentNode,
	        parentNode: parentNode,
	        currentIndex: currentIndex,
	        path: path.concat(currentIndex)
	      });
	    }
	  });
	
	  removeQueue.sort(sortByIndex);
	
	  if (childrenKey) {
	    updateQueue.concat().forEach(function (o) {
	      var currentChildren = o.currentNode[childrenKey] || [];
	      var nextChildren = o.nextNode[childrenKey] || [];
	      // bottom up
	      var ret = diff(currentChildren, nextChildren, options, {
	        path: o.path,
	        parentNode: o.currentNode
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
	
	function diffTree(currentNodes, nextNodes, options) {
	  return diff(currentNodes, nextNodes, options);
	}
	module.exports = exports['default'];

/***/ },

/***/ 177:
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
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
	    if (q.type === 'move') {
	      moves[q.toPath.join(',')] = ret;
	    }
	  });
	
	  insertQueue.forEach(function (q) {
	    if (q.type === 'new') {
	      processNew(q);
	    } else if (q.type === 'move') {
	      processMove(q, moves[q.toPath.join(',')]);
	    }
	  });
	}
	
	exports.default = patch;
	module.exports = exports['default'];

/***/ }

});
//# sourceMappingURL=arrayString.js.map