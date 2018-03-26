// @flow

export type NodeId = number | string

export type StrategyOptions<T> = {
  isVisited?: (T, Array<NodeId>) => ?number,
  isGoal: (T) => boolean,
  expand: (T) => Array<T>,
  extractId: (T) => NodeId,
  shouldContinue?: (T, number, number) => boolean,
}

export default class Strategy<T> {
  customIsVisited: ?(T, Array<NodeId>) => ?number
  isGoal: (T) => boolean
  expand: (T) => Array<T>
  extractId: (T) => NodeId
  customShouldContinue: ?(T, number, number) => boolean

  constructor (options: StrategyOptions<T>) {
    this.isGoal = options.isGoal
    this.expand = options.expand
    this.extractId = options.extractId
    this.customShouldContinue = options.shouldContinue || null
    this.customIsVisited = options.isVisited || null
  }

  shouldContinue (node: T, depth: number, depthLimit: number): boolean {
    if (this.customShouldContinue) {
      return this.customShouldContinue(node, depth, depthLimit)
    }

    return true
  }

  isVisited (node: T, visited: Array<NodeId>): ?number {
    if (this.customIsVisited) {
      return this.customIsVisited(node, visited)
    }

    const index = visited.indexOf(this.extractId(node))
    return index < 0 ? null : index
  }
}
