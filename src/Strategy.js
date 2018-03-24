// @flow

export type NodeId = number | string

export type StrategyOptions<T> = {
  isVisited?: (T, Array<NodeId>) => ?number,
  isGoal: (T) => boolean,
  expand: (T) => Array<T>,
  extractId: (T) => NodeId,
}

export default class Strategy<T> {
  customIsVisited: ?(T, Array<NodeId>) => ?number
  isGoal: (T) => boolean
  expand: (T) => Array<T>
  extractId: (T) => NodeId

  constructor(options: StrategyOptions<T>) {
    this.isGoal = options.isGoal
    this.expand = options.expand
    this.extractId = options.extractId
    this.customIsVisited = options.isVisited || null
  }

  isVisited (node: T, visited: Array<NodeId>): ?number {
    if (this.customIsVisited) {
      return this.customIsVisited(node, visited)
    }

    const index = visited.indexOf(this.extractId(node))
    return index < 0 ? null : index
  }
}
 