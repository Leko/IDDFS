// @flow
import assert from 'assert'
import { describe, it } from 'mocha'
import sinon from 'sinon'
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
  it('Must call onVisit every visited nodes', async () => {
    const spy = sinon.spy()
    const expected = [
      ['A', 0, []],
      ['A', 0, []],
      ['B', 1, ['B']],
      ['C', 1, ['C']],
      ['A', 0, []],
      ['B', 1, ['B']],
      ['A', 2, ['B', 'A']],
      ['E', 2, ['B', 'E']],
    ]

    await iddfs({
      initialNode: A,
      isGoal: (node: Node) => node === E,
      expand: (node: Node) => edges[node],
      extractId: (node: Node) => node,
      maxDepth: 3,
      onVisit: spy,
    })

    assert.deepEqual(spy.getCalls().map(c => c.args), expected)
  })
})
