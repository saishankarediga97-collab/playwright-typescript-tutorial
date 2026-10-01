import type { QuizQuestion } from '../types/curriculum';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    module: 'typescript',
    question: 'In TypeScript, what is the primary difference between `unknown` and `any`?',
    options: [
      'There is no difference; they are aliases for each other.',
      '`unknown` is type-safe: you cannot access properties or invoke methods on it without first narrowing its type, whereas `any` disables all type checks.',
      '`any` can only hold objects, while `unknown` can only hold primitives.',
      '`unknown` exists at runtime, while `any` is erased at compile time.'
    ],
    correctIndex: 1,
    explanation: '`unknown` is the type-safe counterpart of `any`. Any value can be assigned to `unknown`, but TypeScript forces you to perform type checks (like `typeof` or `instanceof`) before performing operations.'
  },
  {
    id: 'q2',
    module: 'typescript',
    question: 'In the method chaining pattern `let BasePage = await open(DashboardPage).then((_) => _.clickLoginButton())`, what must `clickLoginButton()` return to allow further `.then()` chaining?',
    options: [
      'It must return `void`.',
      'It must return `Promise<boolean>`.',
      'It must return `this` or `Promise<this>` (or the next Page instance).',
      'It must return the raw Playwright `Page` object.'
    ],
    correctIndex: 2,
    explanation: 'To chain asynchronous methods via `.then((_) => _)`, each method must resolve to the page instance (`Promise<this>`) so that the subsequent `.then()` callback receives the page object with full autocomplete.'
  },
  {
    id: 'q3',
    module: 'dsa',
    question: 'What is the time complexity of prepending an element to the head of a Singly Linked List vs using JavaScript `Array.prototype.unshift()`?',
    options: [
      'Linked List: O(n), Array: O(1)',
      'Linked List: O(1), Array: O(n)',
      'Both are O(1)',
      'Both are O(n)'
    ],
    correctIndex: 1,
    explanation: 'Prepending to a linked list simply creates a new node and updates the head pointer in O(1) constant time. In a native JavaScript array, `unshift()` must shift every existing element over in memory, requiring O(n) linear time.'
  },
  {
    id: 'q4',
    module: 'playwright',
    question: 'Why should you prefer Playwright\'s `request` fixture for API calls instead of opening a browser page and calling `fetch()`?',
    options: [
      'Playwright\'s `request` fixture runs without launching a browser, executing requests 10x-50x faster with lower memory usage.',
      '`fetch()` inside browser pages cannot send POST requests.',
      '`request` is only supported on Chromium.',
      'The browser cannot send JSON headers.'
    ],
    correctIndex: 0,
    explanation: '`request` uses Node-level HTTP connection pooling without the overhead of browser processes, rendering engines, or DOM manipulation, making API tests lightning-fast.'
  },
  {
    id: 'q5',
    module: 'typescript',
    question: 'Which built-in utility type makes all properties of an interface optional, making it ideal for PATCH API payloads and query filters?',
    options: [
      'Omit<T, K>',
      'Pick<T, K>',
      'Partial<T>',
      'Readonly<T>'
    ],
    correctIndex: 2,
    explanation: '`Partial<T>` constructs a type with all properties of T set to optional (`?`), which is ideal for partial updates.'
  },
  {
    id: 'q6',
    module: 'dsa',
    question: 'Which traversal algorithm should you use on a Page Navigation Graph to find the shortest sequence of clicks to navigate from HomePage to CheckoutPage?',
    options: [
      'Depth-First Search (DFS)',
      'Breadth-First Search (BFS)',
      'In-Order Traversal',
      'Post-Order Traversal'
    ],
    correctIndex: 1,
    explanation: 'BFS explores neighbor nodes level-by-level, which mathematically guarantees finding the shortest unweighted path between two nodes in a graph.'
  }
];
