// @flow
import assert from 'assert'
import { describe, it } from 'mocha'
import iddfs from '../src/index'

describe('Simple graph', () => {
  const A = 'A'
  const B = 'B'
  const C = 'C'
  const D = 'D'
  const E = 'E'
  type Node = typeof A | typeof B | typeof C | typeof D | typeof E

  // [A]=[B]=====[E]
  //    \[C]-[D]/
  const edges: { [Node]: Array<Node> } = {
    A: [B, C],
    B: [A, E],
    C: [A, D],
    D: [C, E],
    E: [B, D],
  }

  it('Can resolve with shortest cost', async () => {
    const found = await iddfs({
      initialNode: A,
      isGoal: (node: Node) => node === E,
      expand: (node: Node) => edges[node],
      extractId: (node: Node) => node,
      maxDepth: 3,
    })

    assert.equal(found, E)
  })
})
