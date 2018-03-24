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
  if (depthLimit > 5) {
    return null
  }
  if (depth === depthLimit) {
    return strategy.isGoal(node) ? node : null
  }

  const nodes: Array<T> = strategy.expand(node)
  for (let child of nodes) {
    const id: NodeId = strategy.extractId(child)
    const visitedDepth = strategy.isVisited(child, visited)
    if (visitedDepth && visitedDepth >= depth) {
      continue
    }

    // TODO: 枝刈り
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

  for (let depthLimit = initialDepth; depthLimit < maxDepth; depthLimit++) {
    const found = await dls(initialNode, strategy, depthLimit)
    if (found !== null) {
      return found
    }
  }

  return null
}
