// @flow
import assert from 'assert'
import { describe, it } from 'mocha'
import isEqual from 'lodash/isEqual'
import iddfs from '../src/index'

type Node = string

const swap = (str, from, to) => {
  const min = Math.min(from, to)
  const max = Math.max(from, to)
  return str.substr(0, min) + str[max] + str.substring(min + 1, max) + str[min] + str.substr(max + 1)
}

describe('8 puzzle (with branch and bound)', async () => {
  const edges = [
    [1, 3],
    [0, 2, 4],
    [1, 5],
    [0, 4, 6],
    [1, 3, 5, 7],
    [2, 4, 8],
    [3, 7],
    [4, 6, 8],
    [5, 7],
  ]
  const distances = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 2, 1, 2, 3, 2, 3, 4],
    [1, 0, 1, 2, 1, 2, 3, 2, 3],
    [2, 1, 0, 3, 2, 1, 4, 3, 2],
    [1, 2, 3, 0, 1, 2, 1, 2, 3],
    [2, 1, 2, 1, 0, 1, 2, 1, 2],
    [3, 2, 1, 2, 1, 0, 3, 2, 1],
    [2, 3, 4, 1, 2, 3, 0, 1, 2],
    [3, 2, 3, 2, 1, 2, 1, 0, 1],
  ]
  const goal: Node = '123456780'
  const init: Node = '867254301'
  const COST = 31
  // http://www.geocities.jp/m_hiroi/func/ocaml20.html

  it('can solve with shortest cost', async () => {
    const found = await iddfs({
      initialNode: init,
      isGoal: (node: Node) => isEqual(node, goal),
      expand: (node: Node) => {
        const emptyIndex = node.indexOf('0')
        return edges[emptyIndex].map(moveIndex => swap(node, emptyIndex, moveIndex))
      },
      extractId: (node: Node) => node,
      shouldContinue: (node: Node, depth: number, depthLimit: number) => {
        let cost = 0
        for (let i = 0; i < node.length; i++) {
          cost += distances[Number(node[i])][i]
        }

        return cost <= (depthLimit - depth)
      },
      maxDepth: COST,
    })
    assert.equal(found, goal)
  }).timeout(5000)
})
