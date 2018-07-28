// @flow
import assert from "assert";
import { describe, it } from "mocha";
import sinon from "sinon";
import getNode, { getPath } from "../src/index";

describe("Simple graph", () => {
  const A = "A";
  const B = "B";
  const C = "C";
  const D = "D";
  const E = "E";
  type Node = typeof A | typeof B | typeof C | typeof D | typeof E;

  // [A]=[B]=====[E]
  //    \[C]-[D]/
  const edges: { [Node]: Array<Node> } = {
    A: [B, C],
    B: [A, E],
    C: [A, D],
    D: [C, E],
    E: [B, D]
  };

  describe("getNode", () => {
    it("Can resolve with shortest cost", async () => {
      const found = await getNode({
        initialNode: A,
        isGoal: (node: Node) => node === E,
        expand: (node: Node) => edges[node],
        extractId: (node: Node) => node,
        maxDepth: 3
      });

      assert.equal(found, E);
    });
    it("Must call onVisit every visited nodes", async () => {
      const spy = sinon.spy();
      const expected = [
        ["A", 1, ["A"]],
        ["A", 1, ["A"]],
        ["B", 2, ["A", "B"]],
        ["C", 2, ["A", "C"]],
        ["A", 1, ["A"]],
        ["B", 2, ["A", "B"]],
        ["A", 3, ["A", "B", "A"]],
        ["E", 3, ["A", "B", "E"]]
      ];

      await getNode({
        initialNode: A,
        isGoal: (node: Node) => node === E,
        expand: (node: Node) => edges[node],
        extractId: (node: Node) => node,
        maxDepth: 3,
        onVisit: spy
      });

      assert.deepEqual(spy.getCalls().map(c => c.args), expected);
    });
  });
  describe("getPath", () => {
    it("Can resolve with shortest path", async () => {
      const path = await getPath({
        initialNode: A,
        isGoal: (node: Node) => node === E,
        expand: (node: Node) => edges[node],
        extractId: (node: Node) => node,
        maxDepth: 3
      });

      assert.deepStrictEqual(path, [A, B, E]);
    });
  });
});
