// @flow
import Strategy, { type NodeId, type StrategyOptions } from "./Strategy";

type Option<T> = {
  initialNode: T,
  initialDepth?: number,
  maxDepth?: number
} & StrategyOptions<T>;

type Result<T> = {
  node: T,
  path: Array<NodeId>
};

const defaults = {
  initialDepth: 0,
  maxDepth: Infinity
};

async function dls<T>(
  node: T,
  strategy: Strategy<T>,
  depthLimit: number,
  visited: Array<NodeId> = []
): Promise<?Result<T>> {
  const depth = visited.length;
  strategy.onVisit(node, depth, visited);
  if (depth === depthLimit) {
    return strategy.isGoal(node) ? { node, path: visited } : null;
  }
  if (!strategy.shouldContinue(node, depth, depthLimit)) {
    return null;
  }

  const nodes: Array<T> = await strategy.expand(node);
  for (let child of nodes) {
    const id: NodeId = strategy.extractId(child);
    const visitedDepth = strategy.isVisited(child, visited);
    if (visitedDepth && visitedDepth >= depth) {
      continue;
    }

    const found = await dls(child, strategy, depthLimit, visited.concat([id]));
    if (found !== null) {
      return found;
    }
  }

  return null;
}

export async function search<T>(op: Option<T>): Promise<?Result<T>> {
  const { initialDepth, maxDepth, initialNode, ...strategyOptions } = {
    ...defaults,
    ...op
  };
  const strategy = new Strategy((strategyOptions: StrategyOptions<T>));
  const initialNodeId = strategy.extractId(initialNode);

  for (let depthLimit = initialDepth; depthLimit <= maxDepth; depthLimit++) {
    const found = await dls(initialNode, strategy, depthLimit + 1, [
      initialNodeId
    ]);
    if (found !== null) {
      return found;
    }
  }

  return null;
}

export default async function getNode<T>(op: Option<T>): Promise<?T> {
  const result = await search(op);
  return result && result.node;
}

export async function getPath<T>(op: Option<T>): Promise<?Array<NodeId>> {
  const result = await search(op);
  return result && result.path;
}
