// @flow
import Strategy, { type NodeId, type StrategyOptions } from './Strategy'

type Option<T> = {
  initialNode: T,
  initialDepth?: number,
  maxDepth?: number,
} & StrategyOptions<T>

const defaults = {
  initialDepth: 0,
  maxDepth: Infinity,
}

async function dls<T> (node: T, strategy: Strategy<T>, depthLimit: number, visited: Array<NodeId> = []): Promise<?T> {
  const depth = visited.length
  if (depth === depthLimit) {
    return strategy.isGoal(node) ? node : null
  }
  if (!strategy.shouldContinue(node, depth, depthLimit)) {
    return null
  }

  const nodes: Array<T> = strategy.expand(node)
  for (let child of nodes) {
    const id: NodeId = strategy.extractId(child)
    const visitedDepth = strategy.isVisited(child, visited)
    if (visitedDepth && visitedDepth >= depth) {
      continue
    }

    const node = await dls(child, strategy, depthLimit, visited.concat([id]))
    if (node !== null) {
      return node
    }
  }

  return null
}

export default async function search <T> (op: Option<T>): Promise<?T> {
  const { initialDepth, maxDepth, initialNode, ...strategyOptions } = { ...defaults, ...op }
  const strategy = new Strategy((strategyOptions: StrategyOptions<T>))

  for (let depthLimit = initialDepth; depthLimit <= maxDepth; depthLimit++) {
    const found = await dls(initialNode, strategy, depthLimit)
    if (found !== null) {
      return found
    }
  }

  return null
}
