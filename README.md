# tree-diff

diff tree nodes like React.

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![gemnasium deps][gemnasium-image]][gemnasium-url]
[![npm download][download-image]][download-url]

[npm-image]: http://img.shields.io/npm/v/tree-diff.svg?style=flat-square
[npm-url]: http://npmjs.org/package/tree-diff
[travis-image]: https://img.shields.io/travis/yiminghe/tree-diff.svg?style=flat-square
[travis-url]: https://travis-ci.org/yiminghe/tree-diff
[coveralls-image]: https://img.shields.io/coveralls/yiminghe/tree-diff.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/yiminghe/tree-diff?branch=master
[gemnasium-image]: http://img.shields.io/gemnasium/yiminghe/tree-diff.svg?style=flat-square
[gemnasium-url]: https://gemnasium.com/yiminghe/tree-diff
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/tree-diff.svg?style=flat-square
[download-url]: https://npmjs.org/package/tree-diff

## Demo

http://yiminghe.github.io/tree-diff

## Api

### diff(fromNodes: any[], afterNodes : any[], options = {}): Patch

#### options.shouldUpdate(node1, node2, node1Index, node2Index)

decide whether change node1 to node2 or detroy node1 and recreate node2

#### options.childrenKey="children"

children member name if node type is object

### patch(patcher: Patcher, operations)

for example: src/dom/patchDOM.js

#### operations.processNew

how to process new node

#### operations.processRemove

how to process node removal

#### operations.processMove

how to process node move

#### operations.processUpdate

how to process node update