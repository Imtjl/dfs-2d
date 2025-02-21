export const dfs = (graph, start) => {
	const stack = [start],
		visited = new Set([start]),
		trace = [start];

	while (stack.length) {
		const curr = stack.pop();

		for (const el of graph[curr]) {
			if (!visited.has(el)) {
				stack.push(el);
				visited.add(el);
				trace.push(el);
			}
		}
	}

	return trace;
};

// example usage
const graph = {
	1: [2, 3],
	2: [4, 5],
	3: [6],
	4: [],
	5: [],
	6: [],
};
console.log(dfs(graph, 1));
