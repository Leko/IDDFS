# IDDFS
Iterative deepening depth-first search (IDDFS) for JavaScript

## Install
```
npm i iddfs
```

### Requirement
- Node.js
  - 4+
- Browser support
  - TODO

## Usage
```js
import iddfs from 'iddfs'

const A = 'A'
const B = 'B'
const C = 'C'
const D = 'D'
const E = 'E'
const F = 'F'
const G = 'G'

// [A]-[B]-[D]
//  |\   `-[F]-,
//  | `[C]-(G) |
//   `-[E]-----/
// Expected: A -> C -> G
// https://ja.wikipedia.org/wiki/%E5%8F%8D%E5%BE%A9%E6%B7%B1%E5%8C%96%E6%B7%B1%E3%81%95%E5%84%AA%E5%85%88%E6%8E%A2%E7%B4%A2
const edges: { [Node]: Array<Node> } = {
  A: [B, C, E],
  B: [A, D, F],
  C: [A, G],
  D: [B],
  E: [A, F],
  F: [B, E],
  G: [C],
}

const found = await iddfs({
  initialNode: A,
  isGoal: (node) => node === G,
  expand: (node) => edges[node],
  extractId: (node) => node,
  maxDepth: 3,
})

console.log(found === G) // => true
```

For more details, please refer out [tests](https://github.com/Leko/IDDFS/tree/master/test)

### Options
|property|required|type|description|
|--------|--------|----|-----------|
|initialNode|Yes|`any`|Node visited at first|
|isGoal|Yes|`(node: any) => boolean`|A function returns boolean what wanted node or not|
|expand|Yes|`(node: any) => Array<node: any>`|A function returns array of children node id|
|extractId|Yes|`(node: any) => string \| number`|A function returns identifier of node|
|initialDepth|-|`number`|Initial depth. Defaults is `0`|
|maxDepth|-|`number`|Max depth. Defaults is `Infinity`|
|isVisited|-|`(node: any, Array<string \| number>) => ?number`|Advanced option. It must returns visited depth when node already visited. Otherwise, it must returns null|

## Contribution
1. Fork this repo
1. Create your branch like `fix-hoge-foo-bar` `add-hige`
1. Write your code
1. Pass all checks (`npm run lint && npm run flow && npm test`)
1. Commit with [gitmoji](https://gitmoji.carloscuesta.me/)
1. Submit pull request to `master` branch

## License
This package under [MIT](https://opensource.org/licenses/MIT) license.
