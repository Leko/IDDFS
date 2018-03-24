// @flow
import assert from 'assert'
import { describe, it } from 'mocha'
import iddfs from '../src/index'

describe('Looped graph', () => {
  const A = 'A'
  const B = 'B'
  const C = 'C'
  const D = 'D'
  const E = 'E'
  const F = 'F'
  const G = 'G'
  type Node = typeof A | typeof B | typeof C | typeof D | typeof E | typeof F | typeof G

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

  it('Can resolve with shortest cost', async () => {
    const found = await iddfs({
      initialNode: A,
      isGoal: (node: Node) => node === G,
      expand: (node: Node) => edges[node],
      extractId: (node: Node) => node,
      maxDepth: 3,
    })

    assert.equal(found, G)
  })
})
