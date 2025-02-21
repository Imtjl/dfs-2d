import { dfs } from './dfs';
import fc from 'fast-check';

describe('dfs - unit tests', () => {
    test('should traverse the given tree in the expected DFS order', () => {
        // Given the tree:
        //     1
        //    / \
        //   2   3
        //  / \   \
        // 4   5   6
        //
        // 1 -> (push 2, then 3) => stack: [2,3]
        // Pop 3, process its child 6 => trace becomes [1,2,3,6]
        // Pop 6, then pop 2, process children [4,5] => trace becomes [1,2,3,6,4,5]
        const tree = new Map<number, number[]>([
            [1, [2, 3]],
            [2, [4, 5]],
            [3, [6]],
            [4, []],
            [5, []],
            [6, []],
        ]);
        const result = dfs(tree, 1);
        expect(result).toEqual([1, 2, 3, 6, 4, 5]);
    });

    test('should not visit any node more than once (white-box invariant)', () => {
        // Create a graph where node 4 is reachable from both 2 and 3.
        const graph = new Map<number, number[]>([
            [1, [2, 3]],
            [2, [4]],
            [3, [4]],
            [4, []],
        ]);
        const result = dfs(graph, 1);
        // Check that node 4 appears exactly once.
        const count4 = result.filter((x) => x === 4).length;
        expect(count4).toBe(1);
    });
});

describe('dfs - property based tests', () => {
    test('DFS result should have no duplicate nodes and include all reachable nodes', () => {
        fc.assert(
            fc.property(
                fc
                    .array(fc.nat(100), { minLength: 1, maxLength: 10 })
                    .map((arr) => Array.from(new Set(arr))),
                (nodes) => {
                    // Ensure we have at least one node.
                    if (nodes.length === 0) return true;
                    const root = nodes[0];
                    // Build a tree: For each node (starting from index 1),
                    // randomly choose a parent among the already seen nodes.
                    const graph = new Map<number, number[]>();
                    nodes.forEach((n) => graph.set(n, []));
                    for (let i = 1; i < nodes.length; i++) {
                        const parent = nodes[Math.floor(Math.random() * i)];
                        graph.get(parent)?.push(nodes[i]);
                    }
                    const trace = dfs(graph, root);
                    const unique = new Set(trace);
                    // Check: no duplicates & trace contains exactly all nodes in the tree.
                    return unique.size === trace.length && unique.size === nodes.length;
                },
            ),
        );
    });

    test('DFS on a chain (linked list) should return nodes in the same order', () => {
        fc.assert(
            fc.property(
                fc
                    .array(fc.nat(50), { minLength: 1, maxLength: 6 })
                    .map((arr) => Array.from(new Set(arr))),
                (nodes) => {
                    if (nodes.length === 0) return true;
                    const root = nodes[0];
                    // Build a chain: each node (except the last) has exactly one child, the next node.
                    const graph = new Map<number, number[]>();
                    for (let i = 0; i < nodes.length; i++) {
                        graph.set(nodes[i], i < nodes.length - 1 ? [nodes[i + 1]] : []);
                    }
                    const trace = dfs(graph, root);
                    // In a chain, DFS should return exactly the nodes in order.
                    return JSON.stringify(trace) === JSON.stringify(nodes);
                },
            ),
        );
    });
});
