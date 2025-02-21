// intuitive iterative approach using stack
export function dfs<T>(graph: Map<T, T[]>, start: T): T[] {
	const visited = new Set<T>(),
		trace: T[] = [],
		stack: T[] = [];

	visited.add(start);
	stack.push(start);
	trace.push(start);

	while (stack.length) {
		const current = stack.pop()!;
		for (const child of graph.get(current) || []) {
			if (!visited.has(child)) {
				visited.add(child);
				stack.push(child);
				trace.push(child);
			}
		}
	}

	return trace;
}

// // example usage
// const tree = new Map<number, number[]>([
// 	[1, [2, 3]],
// 	[2, [4, 5]],
// 	[3, [6]],
// 	[4, []],
// 	[5, []],
// 	[6, []],
// ]);
// console.log(dfs(tree, 1));
//
// // want graph with different types?
// type Node = number | string | Set<number>
// const tree2 = new Map<Node, Node[]>([
//     [1, ['2', 34, new Set([5, 6])]]
// ])
// console.log(dfs(tree2, 1))
