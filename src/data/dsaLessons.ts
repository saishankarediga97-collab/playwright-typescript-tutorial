import type { Lesson } from '../types/curriculum';

export const dsaLessons: Lesson[] = [
  {
    id: 'dsa-big-o',
    moduleId: 'dsa',
    title: '1. Big-O Complexity & Performance Analysis in TypeScript',
    subtitle: 'Time Complexity, Space Complexity, and Micro-Benchmarking',
    readingTime: '15 min',
    level: 'Beginner',
    tags: ['Big-O', 'Algorithms', 'Time Complexity', 'Space Complexity'],
    overview: 'Before implementing data structures, understand asymptotic Big-O notation, how JavaScript engines (V8) optimize arrays, and why choosing the right data structure matters for high-scale automation and application engineering.',
    keyTakeaways: [
      'O(1) Constant Time: Hash table lookups, array indexing, push/pop at end of array.',
      'O(log n) Logarithmic Time: Binary Search, balanced BST operations.',
      'O(n) Linear Time: Unordered search, shift/unshift operations on native JS arrays.',
      'O(n log n): Optimal comparison-based sorting (MergeSort, QuickSort).'
    ],
    sections: [
      {
        id: 'big-o-chart',
        title: 'Asymptotic Growth Hierarchy',
        content: `From fastest to slowest:
1. **$O(1)$** - Constant Time: Direct memory offset calculations
2. **$O(\\log n)$** - Logarithmic: Dividing the search space in half each step
3. **$O(n)$** - Linear: Inspecting every element sequentially
4. **$O(n \\log n)$** - Linearithmic: Divide and conquer algorithms (QuickSort / MergeSort)
5. **$O(n^2)$** - Quadratic: Nested loops (BubbleSort, SelectionSort)
6. **$O(2^n)$** - Exponential: Brute force recursion without memoization`,
        snippet: {
          title: 'Benchmarking O(1) vs O(n) in TypeScript',
          language: 'typescript',
          runnable: true,
          code: `// Compare Array.includes() O(n) vs Set.has() O(1)
const count = 100000;
const testArray: number[] = [];
const testSet = new Set<number>();

for (let i = 0; i < count; i++) {
  testArray.push(i);
  testSet.add(i);
}

const target = 99999;

// 1. Array search O(n)
console.time('Array.includes O(n)');
const inArray = testArray.includes(target);
console.timeEnd('Array.includes O(n)');

// 2. Set lookup O(1)
console.time('Set.has O(1)');
const inSet = testSet.has(target);
console.timeEnd('Set.has O(1)');

console.log('Result found in both:', inArray && inSet);
`
        }
      }
    ],
    playgroundCode: `// Try analyzing Fibonacci with Big-O:
// Recursive: O(2^n) - very slow!
function fibRecursive(n: number): number {
  if (n <= 1) return n;
  return fibRecursive(n - 1) + fibRecursive(n - 2);
}

// Iterative with DP: O(n) time, O(1) space!
function fibIterative(n: number): number {
  if (n <= 1) return n;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    const next = a + b;
    a = b;
    b = next;
  }
  return b;
}

console.log('Iterative Fib(35):', fibIterative(35));
console.log('Iterative Fib(50):', fibIterative(50));
`
  },
  {
    id: 'dsa-linked-list',
    moduleId: 'dsa',
    title: '2. Generic Singly & Doubly Linked Lists',
    subtitle: 'Node Pointers, Insertion, Deletion, and In-Place Reversal with TypeScript Generics',
    readingTime: '20 min',
    level: 'Intermediate',
    tags: ['Linked List', 'Pointers', 'Generics', 'In-Place Reversal'],
    overview: 'Implement a fully typed generic Singly Linked List with head and tail pointers, O(1) append/prepend, in-place reversal, and cycle detection.',
    keyTakeaways: [
      'Linked lists allocate memory non-contiguously using node pointers (next and prev).',
      'Prepending to a linked list is O(1), whereas unshift() in a JavaScript array is O(n).',
      'TypeScript generics ensure your LinkedList<T> can safely hold strings, objects, numbers, or Page objects.'
    ],
    sections: [
      {
        id: 'singly-linked-list-code',
        title: 'Complete Generic LinkedList<T> Implementation',
        content: `Each node in a singly linked list contains a \`value: T\` and a pointer \`next: LinkedListNode<T> | null\`.
Let's see the full implementation with TypeScript generics.`,
        snippet: {
          title: 'Generic LinkedList<T> with Reversal and Search',
          language: 'typescript',
          runnable: true,
          code: `class LinkedListNode<T> {
  public next: LinkedListNode<T> | null = null;
  constructor(public value: T) {}
}

class LinkedList<T> {
  private head: LinkedListNode<T> | null = null;
  private tail: LinkedListNode<T> | null = null;
  private _length: number = 0;

  get length(): number {
    return this._length;
  }

  // O(1) Append to tail
  append(value: T): this {
    const newNode = new LinkedListNode(value);
    if (!this.head || !this.tail) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this._length++;
    return this;
  }

  // O(1) Prepend to head
  prepend(value: T): this {
    const newNode = new LinkedListNode(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head = newNode;
    }
    this._length++;
    return this;
  }

  // O(n) In-place Reversal (Classic interview question!)
  reverse(): this {
    let prev: LinkedListNode<T> | null = null;
    let curr: LinkedListNode<T> | null = this.head;
    this.tail = this.head;

    while (curr !== null) {
      const nextTemp: LinkedListNode<T> | null = curr.next;
      curr.next = prev;
      prev = curr;
      curr = nextTemp;
    }

    this.head = prev;
    return this;
  }

  toArray(): T[] {
    const result: T[] = [];
    let current = this.head;
    while (current) {
      result.push(current.value);
      current = current.next;
    }
    return result;
  }
}

// TEST IN-BROWSER
const list = new LinkedList<string>();
list.append('Step 1: Open Login')
    .append('Step 2: Enter Credentials')
    .append('Step 3: Click Submit')
    .append('Step 4: Verify Dashboard');

console.log('Original Execution Order:', list.toArray());
list.reverse();
console.log('Reversed Execution Order:', list.toArray());
`
        }
      }
    ],
    playgroundCode: `// Try implementing cycle detection (Floyd's Tortoise and Hare) in TypeScript!
interface NodeWithCycle {
  val: number;
  next: NodeWithCycle | null;
}

function hasCycle(head: NodeWithCycle | null): boolean {
  let slow = head;
  let fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}

const n1: NodeWithCycle = { val: 1, next: null };
const n2: NodeWithCycle = { val: 2, next: null };
const n3: NodeWithCycle = { val: 3, next: null };
n1.next = n2;
n2.next = n3;
// create cycle: n3 -> n1
n3.next = n1;

console.log('Has cycle:', hasCycle(n1));
`
  },
  {
    id: 'dsa-stack-queue',
    moduleId: 'dsa',
    title: '3. Stacks, Queues & Priority Queues',
    subtitle: 'LIFO & FIFO Mechanics, Min-Stack O(1), and Test Job Scheduling',
    readingTime: '18 min',
    level: 'Intermediate',
    tags: ['Stack', 'Queue', 'PriorityQueue', 'LIFO', 'FIFO'],
    overview: 'Learn how browsers maintain the Call Stack and Undo/Redo histories using Stacks (LIFO), and how test runners schedule asynchronous worker jobs using Queues (FIFO) and Priority Queues.',
    keyTakeaways: [
      'Stacks operate on Last-In, First-Out (LIFO) and power browser history and call stacks.',
      'Queues operate on First-In, First-Out (FIFO) and power test execution task queues.',
      'A Min-Stack maintains an auxiliary stack to return the minimum element in O(1) constant time.'
    ],
    sections: [
      {
        id: 'min-stack-code',
        title: 'The O(1) Min-Stack in TypeScript',
        content: `How can you design a stack that supports \`push\`, \`pop\`, \`top\`, and retrieving the minimum element in $O(1)$ time?
We maintain two stacks: the main value stack and a min-tracking stack!`,
        snippet: {
          title: 'MinStack<T> Implementation',
          language: 'typescript',
          runnable: true,
          code: `class MinStack {
  private stack: number[] = [];
  private minStack: number[] = [];

  push(val: number): void {
    this.stack.push(val);
    const currentMin = this.minStack.length === 0 
      ? val 
      : Math.min(val, this.minStack[this.minStack.length - 1]);
    this.minStack.push(currentMin);
  }

  pop(): number | undefined {
    this.minStack.pop();
    return this.stack.pop();
  }

  top(): number | undefined {
    return this.stack[this.stack.length - 1];
  }

  getMin(): number | undefined {
    return this.minStack[this.minStack.length - 1];
  }
}

const minStack = new MinStack();
minStack.push(-2);
minStack.push(0);
minStack.push(-3);

console.log('Current Min (expected -3):', minStack.getMin());
minStack.pop();
console.log('Top element after pop:', minStack.top());
console.log('Current Min after pop (expected -2):', minStack.getMin());
`
        }
      },
      {
        id: 'priority-queue-code',
        title: 'Priority Queue for Test Execution Scheduling',
        content: `In a production test suite, tests marked with \`@p0\` or \`@smoke\` must execute before \`@regression\` or \`@perf\` tests. A Priority Queue handles this efficiently.`,
        snippet: {
          title: 'Generic Priority Queue for Test Runner',
          language: 'typescript',
          runnable: true,
          code: `interface TestTask {
  id: string;
  name: string;
  priority: number; // Lower number = higher priority
}

class TestJobQueue {
  private queue: TestTask[] = [];

  enqueue(task: TestTask): void {
    this.queue.push(task);
    // Sort so lowest priority number is at front (min-heap simulation)
    this.queue.sort((a, b) => a.priority - b.priority);
  }

  dequeue(): TestTask | undefined {
    return this.queue.shift();
  }

  isEmpty(): boolean {
    return this.queue.length === 0;
  }
}

const runner = new TestJobQueue();
runner.enqueue({ id: 'T1', name: 'Profile UI Validation', priority: 3 });
runner.enqueue({ id: 'T2', name: 'Critical Login Auth', priority: 1 });
runner.enqueue({ id: 'T3', name: 'Payment Gateway Stripe', priority: 1 });
runner.enqueue({ id: 'T4', name: 'Footer Links Check', priority: 4 });

console.log('--- Executing Tasks by Priority ---');
while (!runner.isEmpty()) {
  const task = runner.dequeue()!;
  console.log(\`[P\${task.priority}] Running: \${task.name} (\${task.id})\`);
}
`
        }
      }
    ],
    playgroundCode: `// Try evaluating balanced parentheses (using a Stack):
function isValidParentheses(s: string): boolean {
  const stack: string[] = [];
  const map: Record<string, string> = { ')': '(', '}': '{', ']': '[' };

  for (const char of s) {
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else if (char in map) {
      if (stack.pop() !== map[char]) return false;
    }
  }
  return stack.length === 0;
}

console.log('"{[()]}":', isValidParentheses('{[()]}')); // true
console.log('"{[(])}":', isValidParentheses('{[(])}')); // false
`
  },
  {
    id: 'dsa-binary-tree-bst',
    moduleId: 'dsa',
    title: '4. Binary Trees & Binary Search Trees (BST)',
    subtitle: 'Hierarchical Structures, Traversals (DFS & BFS), and Search Operations',
    readingTime: '22 min',
    level: 'Advanced',
    tags: ['Trees', 'BST', 'In-Order', 'BFS', 'DFS'],
    overview: 'The HTML Document Object Model (DOM) is fundamentally a tree structure. Master Binary Search Trees (BST), tree traversals (In-order, Pre-order, Level-order BFS), and search operations in TypeScript.',
    keyTakeaways: [
      'A Binary Search Tree maintains the invariant: left child < parent < right child.',
      'In-Order traversal (Left -> Node -> Right) visits BST nodes in sorted ascending order.',
      'Breadth-First Search (Level Order) uses a Queue to inspect trees level-by-level (mirroring DOM tree traversals).'
    ],
    sections: [
      {
        id: 'bst-implementation',
        title: 'Generic Binary Search Tree with Traversals',
        content: `Let's implement a generic Binary Search Tree \`BST<T>\` with insert, search, in-order DFS, and level-order BFS traversals.`,
        snippet: {
          title: 'Full Binary Search Tree Implementation',
          language: 'typescript',
          runnable: true,
          code: `class TreeNode<T> {
  public left: TreeNode<T> | null = null;
  public right: TreeNode<T> | null = null;
  constructor(public value: T) {}
}

class BinarySearchTree<T> {
  public root: TreeNode<T> | null = null;

  insert(value: T): this {
    const newNode = new TreeNode(value);
    if (!this.root) {
      this.root = newNode;
      return this;
    }

    let current = this.root;
    while (true) {
      if (value < current.value) {
        if (!current.left) {
          current.left = newNode;
          break;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = newNode;
          break;
        }
        current = current.right;
      }
    }
    return this;
  }

  // In-Order Traversal (Returns sorted array)
  inOrderTraversal(): T[] {
    const result: T[] = [];
    function traverse(node: TreeNode<T> | null) {
      if (!node) return;
      traverse(node.left);
      result.push(node.value);
      traverse(node.right);
    }
    traverse(this.root);
    return result;
  }

  // Level-Order BFS Traversal (Queue based)
  levelOrderTraversal(): T[] {
    if (!this.root) return [];
    const result: T[] = [];
    const queue: TreeNode<T>[] = [this.root];

    while (queue.length > 0) {
      const node = queue.shift()!;
      result.push(node.value);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    return result;
  }
}

const bst = new BinarySearchTree<number>();
[50, 30, 70, 20, 40, 60, 80].forEach(n => bst.insert(n));

console.log('In-Order (Sorted Ascending):', bst.inOrderTraversal());
console.log('Level-Order (Breadth-First BFS):', bst.levelOrderTraversal());
`
        }
      }
    ],
    playgroundCode: `// Try calculating maximum depth of a binary tree:
function maxDepth<T>(root: TreeNode<T> | null): number {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

console.log('Tree Depth:', maxDepth(bst.root));
`
  },
  {
    id: 'dsa-graphs',
    moduleId: 'dsa',
    title: '5. Graphs, BFS, DFS & Dependency Resolvers',
    subtitle: 'Adjacency Lists, Cycle Detection, and Page Navigation Flows',
    readingTime: '24 min',
    level: 'Advanced',
    tags: ['Graphs', 'BFS', 'DFS', 'Adjacency List', 'Topological Sort'],
    overview: 'Web applications and Page Object Models are networks of connected pages. Model application user journeys and automated test suites as directed graphs, performing BFS shortest path and cycle detection.',
    keyTakeaways: [
      'Graphs consist of vertices (nodes) and edges (connections), commonly stored as an Adjacency List (Map<V, Set<V>>).',
      'Breadth-First Search (BFS) finds the shortest sequence of page clicks between two pages.',
      'Depth-First Search (DFS) is used for pathfinding, topological sorting, and dependency resolution.'
    ],
    sections: [
      {
        id: 'graph-implementation',
        title: 'Generic Graph with BFS Shortest Path',
        content: `Let's model the navigation flow between Page Objects (LoginPage -> DashboardPage -> SettingsPage, etc.) as a directed graph.`,
        snippet: {
          title: 'Page Navigation Graph with BFS Shortest Path',
          language: 'typescript',
          runnable: true,
          code: `class NavigationGraph<T> {
  private adjacencyList = new Map<T, Set<T>>();

  addVertex(vertex: T): void {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, new Set());
    }
  }

  addEdge(from: T, to: T): void {
    this.addVertex(from);
    this.addVertex(to);
    this.adjacencyList.get(from)!.add(to);
  }

  // BFS to find shortest transition path between two pages
  findShortestPath(start: T, target: T): T[] | null {
    const queue: [T, T[]][] = [[start, [start]]];
    const visited = new Set<T>([start]);

    while (queue.length > 0) {
      const [current, path] = queue.shift()!;
      if (current === target) return path;

      const neighbors = this.adjacencyList.get(current) || new Set();
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push([neighbor, [...path, neighbor]]);
        }
      }
    }
    return null;
  }
}

const sitemap = new NavigationGraph<string>();
sitemap.addEdge('Home', 'Login');
sitemap.addEdge('Login', 'Dashboard');
sitemap.addEdge('Dashboard', 'Orders');
sitemap.addEdge('Dashboard', 'Settings');
sitemap.addEdge('Settings', 'Security');
sitemap.addEdge('Home', 'PublicCatalog');
sitemap.addEdge('PublicCatalog', 'ProductDetail');
sitemap.addEdge('ProductDetail', 'Login');

const path = sitemap.findShortestPath('Home', 'Security');
console.log('Shortest Navigation Route from Home to Security:');
console.log(path ? path.join(' ➔ ') : 'No path found');
`
        }
      }
    ],
    playgroundCode: `// Try writing DFS to check if a path exists between two nodes:
function hasPathDfs<T>(
  graph: Map<T, Set<T>>, 
  src: T, 
  dst: T, 
  visited = new Set<T>()
): boolean {
  if (src === dst) return true;
  if (visited.has(src)) return false;
  visited.add(src);

  for (const neighbor of graph.get(src) || []) {
    if (hasPathDfs(graph, neighbor, dst, visited)) return true;
  }
  return false;
}

const g = new Map<string, Set<string>>([
  ['A', new Set(['B', 'C'])],
  ['B', new Set(['D'])],
  ['C', new Set(['E'])],
  ['D', new Set([])],
  ['E', new Set(['F'])],
  ['F', new Set([])]
]);

console.log('Path A -> F exists:', hasPathDfs(g, 'A', 'F'));
console.log('Path D -> C exists:', hasPathDfs(g, 'D', 'C'));
`
  }
];
