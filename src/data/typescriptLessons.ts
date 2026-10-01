import type { Lesson } from '../types/curriculum';

export const typescriptLessons: Lesson[] = [
  {
    id: 'ts-foundations',
    moduleId: 'typescript',
    title: '1. TypeScript Foundations & Compiler Architecture',
    subtitle: 'Type Inference, Strict Mode, and Compiler Mechanics',
    readingTime: '12 min',
    level: 'Beginner',
    tags: ['tsconfig', 'Strict Mode', 'Type Inference', 'Core Engine'],
    overview: 'Understand how TypeScript transforms JavaScript into a strictly-typed, enterprise-ready language. Explore tsconfig.json configurations crucial for test automation and production development.',
    keyTakeaways: [
      'TypeScript acts as a static analysis layer that is completely erased at runtime.',
      'Always enable strict: true in enterprise frameworks to prevent undefined is not a function bugs.',
      'Type inference allows TS to deduce types automatically without unnecessary boilerplate annotations.'
    ],
    sections: [
      {
        id: 'ts-compiler',
        title: 'How the TypeScript Compiler (tsc) Works',
        content: `TypeScript does two primary things:
1. **Type Checking**: Analyzes code statically at design/compile time to catch semantic mismatches.
2. **Transpilation / Code Generation**: Strips out all type annotations, interfaces, and type aliases, emitting standard JavaScript (ES6, ES2022, etc.).

Unlike languages like Java or C#, **types do NOT exist at runtime** in TypeScript. This is called **Type Erasure**.`,
        callout: {
          type: 'production',
          title: 'Production Automation Tip',
          text: 'In Playwright test suites, Playwright compiles TypeScript files on-the-fly using @babel/preset-typescript / esbuild. However, you should still run `tsc --noEmit` in your CI pipeline to catch type errors before tests execute!'
        },
        snippet: {
          title: 'Enterprise tsconfig.json for Playwright & TypeScript',
          language: 'json',
          code: `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022", "DOM"],
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "@pages/*": ["src/pages/*"],
      "@fixtures/*": ["src/fixtures/*"],
      "@utils/*": ["src/utils/*"],
      "@api/*": ["src/api/*"]
    }
  },
  "include": ["src/**/*", "tests/**/*", "playwright.config.ts"]
}`
        }
      },
      {
        id: 'type-inference',
        title: 'Type Inference vs Explicit Annotations',
        content: `TypeScript is smart: if you assign a value immediately, TypeScript automatically infers the exact type.
Explicit annotations are mandatory when:
- Declaring variables without immediate assignment
- Function parameters
- Complex objects and API payloads`,
        snippet: {
          title: 'Type Inference in Action',
          language: 'typescript',
          runnable: true,
          code: `// 1. Inferred Types
let testTimeout = 30000; // Inferred as: number
let environment = 'staging'; // Inferred as: string
let isHeadless = true; // Inferred as: boolean

// 2. Explicit Type Annotation
let retryCount: number;
retryCount = 3;

// 3. Array Types
let supportedBrowsers: string[] = ['chromium', 'firefox', 'webkit'];
let viewportDimensions: [width: number, height: number] = [1920, 1080]; // Tuple

console.log('Environment:', environment);
console.log('Browsers:', supportedBrowsers.join(', '));
console.log('Viewport:', viewportDimensions[0], 'x', viewportDimensions[1]);
`
        }
      }
    ],
    playgroundCode: `// Try modifying these types and observe the live compiler output!
interface TestSuiteConfig {
  name: string;
  retries: number;
  tags: string[];
  parallel: boolean;
}

const checkoutConfig: TestSuiteConfig = {
  name: 'E2E Checkout Flow',
  retries: 2,
  tags: ['smoke', 'critical', 'p1'],
  parallel: true,
};

console.log('Test Config Initialized:');
console.log(checkoutConfig);
`
  },
  {
    id: 'ts-primitive-special-types',
    moduleId: 'typescript',
    title: '2. Primitives, Literals, Any, Unknown, Never & Void',
    subtitle: 'Mastering the Full Type Spectrum and Safe Type Handling',
    readingTime: '15 min',
    level: 'Beginner',
    tags: ['Primitives', 'Unknown', 'Never', 'Void', 'Type Safety'],
    overview: 'Dive deep into TypeScript primitives, string/number literal types, and uncover the critical differences between any, unknown, and never.',
    keyTakeaways: [
      'Never use any in production code unless absolutely unavoidable; use unknown instead.',
      'unknown forces explicit type checking before operations can be performed, ensuring type safety.',
      'never represents values that can never occur (e.g. functions throwing errors, exhaustive checks).'
    ],
    sections: [
      {
        id: 'special-types-matrix',
        title: 'The Golden Rule: any vs unknown vs never',
        content: `Understanding these three types separates novice TypeScript coders from senior engineers:

- **\`any\`**: Completely turns off the type checker. Unsafe!
- **\`unknown\`**: The type-safe counterpart of \`any\`. You can store anything, but you **cannot access properties or call methods without first validating or casting its type**.
- **\`never\`**: Represents impossible states. Used for functions that never return, or exhaustive switch checks.
- **\`void\`**: Represents the absence of a return value in functions.`,
        snippet: {
          title: 'Comparing any vs unknown vs never',
          language: 'typescript',
          runnable: true,
          code: `// --- UNKNOWN (Safe Dynamic Data) ---
function parseApiResponse(rawPayload: unknown): string {
  // If we try: rawPayload.toUpperCase(), TS will throw a compile error!
  // We MUST narrow it first:
  if (typeof rawPayload === 'string') {
    return rawPayload.toUpperCase();
  } else if (typeof rawPayload === 'object' && rawPayload !== null && 'message' in rawPayload) {
    return String((rawPayload as { message: unknown }).message);
  }
  return 'UNKNOWN_FORMAT';
}

console.log('Parsed String:', parseApiResponse('Success response'));
console.log('Parsed Object:', parseApiResponse({ message: 'User created' }));

// --- NEVER (Exhaustive Checking) ---
type Browser = 'chromium' | 'firefox' | 'webkit';

function getDriverExecutable(browser: Browser): string {
  switch (browser) {
    case 'chromium':
      return 'chrome.exe';
    case 'firefox':
      return 'firefox.exe';
    case 'webkit':
      return 'playwright-webkit.exe';
    default:
      // If a new browser is added to Browser union and not handled here,
      // TS will produce a compile-time error!
      const _exhaustiveCheck: never = browser;
      throw new Error(\`Unhandled browser: \${_exhaustiveCheck}\`);
  }
}

console.log('Executable:', getDriverExecutable('chromium'));
`
        }
      }
    ],
    playgroundCode: `// Experiment with literal types & unknown narrowing:
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface ApiRequest {
  endpoint: string;
  method: HttpMethod;
  headers?: Record<string, string>;
  payload?: unknown;
}

function dispatchRequest(req: ApiRequest) {
  console.log(\`Dispatching \${req.method} to \${req.endpoint}\`);
  if (req.payload) {
    console.log('Payload attached:', req.payload);
  }
}

dispatchRequest({
  endpoint: '/api/v1/auth/login',
  method: 'POST',
  payload: { username: 'lead_qa', role: 'admin' }
});
`
  },
  {
    id: 'ts-interfaces-types',
    moduleId: 'typescript',
    title: '3. Interfaces, Type Aliases & Duck Typing',
    subtitle: 'Structural Typing, Inheritance, Index Signatures, and Declaration Merging',
    readingTime: '18 min',
    level: 'Intermediate',
    tags: ['Interfaces', 'Type Aliases', 'Structural Typing', 'Extends'],
    overview: 'Learn how to model test domain entities, page objects, and API contracts. Compare Interfaces vs Type Aliases and master TypeScript structural typing system.',
    keyTakeaways: [
      'TypeScript uses Structural Typing (Duck Typing): if two objects have the same shape, they are compatible.',
      'Use interfaces for defining object contracts, page object APIs, and class implementations.',
      'Use type aliases for unions, intersections, primitives, tuples, and mapped types.'
    ],
    sections: [
      {
        id: 'structural-typing',
        title: 'Structural Typing ("Duck Typing")',
        content: `In nominal languages (like Java/C#), two classes with identical fields are NOT interchangeable unless they explicitly inherit from the same ancestor.
In TypeScript, **shape matters, not origin**:
> *"If it walks like a duck and quacks like a duck, it is a duck."*`,
        snippet: {
          title: 'Structural Compatibility in Action',
          language: 'typescript',
          runnable: true,
          code: `interface LocatorTarget {
  selector: string;
  timeout?: number;
}

class ButtonElement {
  constructor(public selector: string, public timeout: number = 5000, public label: string = 'Submit') {}
}

function clickElement(target: LocatorTarget) {
  console.log(\`Clicking element with selector: \${target.selector} (timeout: \${target.timeout || 10000}ms)\`);
}

// Even though ButtonElement is a class and not an explicit implementation of LocatorTarget,
// TypeScript allows it because it satisfies the structure!
const btn = new ButtonElement('#submit-login', 3000, 'Login');
clickElement(btn);

// Object literals with exact structure also match:
clickElement({ selector: '.profile-avatar' });
`
        }
      },
      {
        id: 'interface-vs-type',
        title: 'Interface vs Type Alias: Key Architectural Rules',
        content: `When should you use \`interface\` vs \`type\`?
- **Interface**: Can be extended (\`extends\`), supports **Declaration Merging** (adding properties across modules, which is how Playwright custom fixtures are extended!).
- **Type**: Can represent Unions (\`A | B\`), Tuples (\`[string, number]\`), primitives, and Mapped Types.`,
        snippet: {
          title: 'Extending & Composing Interfaces',
          language: 'typescript',
          runnable: true,
          code: `// Base Page Contract
interface BasePageOptions {
  url: string;
  title: string;
  requiresAuth: boolean;
}

// Extending Page Contract
interface DashboardPageOptions extends BasePageOptions {
  refreshIntervalSeconds: number;
  widgets: string[];
}

const dashboardConfig: DashboardPageOptions = {
  url: '/dashboard',
  title: 'Enterprise Analytics',
  requiresAuth: true,
  refreshIntervalSeconds: 60,
  widgets: ['RevenueChart', 'ActiveUsers', 'ApiLatency']
};

console.log('Dashboard Config:', dashboardConfig);
`
        }
      }
    ],
    playgroundCode: `// Try creating an Index Signature for dynamic test metadata:
interface DynamicTestReport {
  suiteName: string;
  passedCount: number;
  failedCount: number;
  // Index signature allowing dynamic metadata key-values:
  [metricName: string]: string | number;
}

const report: DynamicTestReport = {
  suiteName: 'Regression Suite',
  passedCount: 42,
  failedCount: 0,
  durationSeconds: 124.5,
  executedBy: 'GitHub-Actions-Runner-04'
};

console.log('Report generated:');
for (const [key, val] of Object.entries(report)) {
  console.log(\` - \${key}: \${val}\`);
}
`
  },
  {
    id: 'ts-generics',
    moduleId: 'typescript',
    title: '4. Generics Mastery & Type Constraints',
    subtitle: 'Building Reusable, Type-Safe Components, Drivers, and Algorithms',
    readingTime: '20 min',
    level: 'Advanced',
    tags: ['Generics', 'Type Constraints', 'extends keyof', 'Generic Classes'],
    overview: 'Generics are the cornerstone of production-grade TypeScript frameworks. Learn how to write generic functions, classes, and constraints that make your POM helpers and data structures 100% type-safe.',
    keyTakeaways: [
      'Generics create reusable code templates that operate on arbitrary types while preserving compile-time type safety.',
      'Type constraints (<T extends Entity>) restrict what types can be passed to a generic.',
      'Generics power Playwright fixtures, page navigators, API response deserializers, and DSA implementations.'
    ],
    sections: [
      {
        id: 'generic-functions',
        title: 'Generic Functions & Type Parameter Constraints',
        content: `Consider fetching an API response or extracting a table cell. Without generics, you would either return \`any\` (unsafe) or write repetitive functions for every single type.
With generics, you pass the type as a parameter: \`<T>\`.`,
        snippet: {
          title: 'Generic API Client & Response Deserializer',
          language: 'typescript',
          runnable: true,
          code: `// Generic API Response Container
interface ApiResponse<TData> {
  status: number;
  timestamp: string;
  data: TData;
}

interface UserProfile {
  id: number;
  name: string;
  role: 'admin' | 'tester' | 'developer';
}

interface ProductItem {
  sku: string;
  price: number;
  inStock: boolean;
}

// Generic deserializer function
function parseJsonPayload<T>(rawJson: string): ApiResponse<T> {
  const parsed = JSON.parse(rawJson);
  return {
    status: 200,
    timestamp: new Date().toISOString(),
    data: parsed as T
  };
}

// 1. Parsing User Profile
const userJson = '{"id": 101, "name": "Alice QA", "role": "admin"}';
const userResp = parseJsonPayload<UserProfile>(userJson);
console.log('User parsed: Name =', userResp.data.name, '| Role =', userResp.data.role);

// 2. Parsing Product
const productJson = '{"sku": "LAPTOP-X1", "price": 1499.99, "inStock": true}';
const prodResp = parseJsonPayload<ProductItem>(productJson);
console.log('Product parsed: SKU =', prodResp.data.sku, '| Price =', prodResp.data.price);
`
        }
      },
      {
        id: 'generic-page-factory',
        title: 'The Generic Page Factory (Playwright Preview)',
        content: `Notice how we can write an \`open<T extends BasePage>(PageClass: new (page: any) => T)\` factory!
This is how we achieve the user's requested syntax:
\`let BasePage = await open(DashboardPage).then(...)\``,
        snippet: {
          title: 'Generic Factory Function Pattern',
          language: 'typescript',
          runnable: true,
          code: `// Simulated Page Object Base
class BasePage {
  constructor(public pageName: string) {}
  async ready(): Promise<this> {
    console.log(\`[Factory] Page "\${this.pageName}" is loaded and ready.\`);
    return this;
  }
}

class DashboardPage extends BasePage {
  constructor() {
    super('DashboardPage');
  }
  async clickAnalytics(): Promise<this> {
    console.log('[Dashboard] Clicked Analytics tab.');
    return this;
  }
}

// Generic Page Factory
async function open<T extends BasePage>(PageConstructor: new () => T): Promise<T> {
  const instance = new PageConstructor();
  await instance.ready();
  return instance;
}

// Execute with generic type inference!
async function runTest() {
  const dashboard = await open(DashboardPage);
  await dashboard.clickAnalytics();
  console.log('Test completed successfully for:', dashboard.pageName);
}

runTest();
`
        }
      }
    ],
    playgroundCode: `// Generic Cache / Store implementation:
class EntityRepository<T extends { id: string | number }> {
  private store = new Map<string | number, T>();

  save(entity: T): void {
    this.store.set(entity.id, entity);
    console.log(\`Saved entity id=\${entity.id}\`);
  }

  findById(id: string | number): T | undefined {
    return this.store.get(id);
  }

  count(): number {
    return this.store.size;
  }
}

interface TestRun {
  id: string;
  name: string;
  passed: boolean;
}

const repo = new EntityRepository<TestRun>();
repo.save({ id: 'RUN-001', name: 'Auth Flow', passed: true });
repo.save({ id: 'RUN-002', name: 'Payment Flow', passed: true });

console.log('Total runs in repository:', repo.count());
console.log('Fetched RUN-001:', repo.findById('RUN-001'));
`
  },
  {
    id: 'ts-utility-types',
    moduleId: 'typescript',
    title: '5. Advanced Types, Utility Types & Metaprogramming',
    subtitle: 'Partial, Pick, Omit, Record, ReturnType, Conditional Types & Infer',
    readingTime: '22 min',
    level: 'Advanced',
    tags: ['Utility Types', 'Mapped Types', 'Conditional Types', 'infer'],
    overview: 'Master TypeScript utility types and type metaprogramming. Learn how to transform types, construct immutable state, and dynamically extract function return types.',
    keyTakeaways: [
      'Built-in utility types like Partial<T>, Pick<T, K>, Omit<T, K>, Record<K, V> eliminate duplicate model definitions.',
      'ReturnType<T> and Parameters<T> extract metadata from function signatures dynamically.',
      'Conditional types (T extends U ? X : Y) allow writing dynamic type logic that acts like an if-else for the type system.'
    ],
    sections: [
      {
        id: 'built-in-utilities',
        title: 'Essential Built-in Utility Types in Practice',
        content: `When writing tests, test data often requires only a subset of an API payload (e.g. updating a single field in a PATCH request).
Instead of creating 5 different interfaces, use TypeScript Utility Types!`,
        snippet: {
          title: 'Mastering Partial, Pick, Omit, and Record',
          language: 'typescript',
          runnable: true,
          code: `interface UserAccount {
  id: number;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user' | 'billing';
  lastLogin: Date;
}

// 1. Partial<T>: All properties optional (Perfect for PATCH requests & search filters)
type UpdateUserDto = Partial<UserAccount>;

// 2. Pick<T, K>: Select only specific keys (For public responses)
type PublicUserProfile = Pick<UserAccount, 'id' | 'email' | 'firstName' | 'lastName'>;

// 3. Omit<T, K>: Exclude sensitive keys (Strip passwords & audit timestamps)
type CreateUserPayload = Omit<UserAccount, 'id' | 'lastLogin' | 'passwordHash'> & {
  rawPassword: string;
};

// 4. Record<K, V>: Dictionary mapping
type EnvironmentUrls = Record<'dev' | 'staging' | 'prod', string>;

const envs: EnvironmentUrls = {
  dev: 'https://dev.app.internal',
  staging: 'https://staging.app.io',
  prod: 'https://app.io'
};

const updatePayload: UpdateUserDto = {
  firstName: 'Alexandra'
};

console.log('Environments:', envs);
console.log('Update Payload:', updatePayload);
`
        }
      },
      {
        id: 'conditional-types-infer',
        title: 'Conditional Types & the infer Keyword',
        content: `Conditional types let you make type decisions at compile time:
\`type IsString<T> = T extends string ? true : false;\`

The \`infer\` keyword lets you extract internal types from generic wrappers (like unpacking the return type from a Promise \`Awaited<T>\` or extracting element type from an array).`,
        snippet: {
          title: 'Unpacking Types with infer',
          language: 'typescript',
          runnable: true,
          code: `// Extract return type of a promise
type UnpackPromise<T> = T extends Promise<infer U> ? U : T;

type NumberPromise = Promise<number>;
type UnpackedNumber = UnpackPromise<NumberPromise>; // number

// Extract element type of an array
type ElementOf<T> = T extends (infer E)[] ? E : never;

type StringArray = string[];
type SingleItem = ElementOf<StringArray>; // string

console.log('Conditional types and infer validated!');
`
        }
      }
    ],
    playgroundCode: `// Try creating a ReadonlyDeep or template literal type:
type HttpVerb = 'GET' | 'POST' | 'PUT' | 'DELETE';
type ApiVersion = 'v1' | 'v2';
type Endpoint = \`/api/\${ApiVersion}/\${string}\`;

interface RouteConfig {
  path: Endpoint;
  method: HttpVerb;
}

const loginRoute: RouteConfig = {
  path: '/api/v1/users/login',
  method: 'POST'
};

console.log('Type checked route:', loginRoute);
`
  },
  {
    id: 'ts-classes-oop-chaining',
    moduleId: 'typescript',
    title: '6. Object-Oriented Programming & Method Chaining in TS',
    subtitle: 'Access Modifiers, Abstract Classes, Polymorphism, and Fluent API Design',
    readingTime: '24 min',
    level: 'Advanced',
    tags: ['OOP', 'Classes', 'Method Chaining', 'return this', 'POM'],
    overview: 'This lesson covers the core architecture that powers production Page Object Model (POM) frameworks: Classes, Access Modifiers, and Method Chaining using fluent promises.',
    keyTakeaways: [
      'TypeScript classes provide compile-time access modifiers (public, private, protected) as well as JS private fields (#field).',
      'Abstract classes define common base behavior and enforce template methods on child page classes.',
      'Method Chaining is achieved by returning `this` or `Promise<this>`, enabling fluent workflows.'
    ],
    sections: [
      {
        id: 'fluent-chaining-concept',
        title: 'Designing Fluent Method Chaining in TypeScript',
        content: `In modern automation, writing tests that read like English specifications improves maintainability.
There are two ways to achieve method chaining in TypeScript:
1. **Synchronous Chaining**: Methods return \`this\`.
2. **Asynchronous / Promise Chaining**: Methods return \`Promise<this>\` or return the next Page object. When combined with \`.then((_) => _...)\`, this allows elegant promise chaining as requested in production frameworks:
\`\`\`typescript
let dashboard = await open(DashboardPage)
  .then((_) => _.clickLoginButton())
  .then((_) => _.enterUsername('sarah'))
  .then((_) => _.submit());
\`\`\``,
        snippet: {
          title: 'Fluent Class with Asynchronous Method Chaining',
          language: 'typescript',
          runnable: true,
          code: `// Base Page Simulation
abstract class BasePage {
  constructor(protected pageName: string) {}

  public async logStep(action: string): Promise<this> {
    console.log(\`[\${this.pageName}] Action: \${action}\`);
    return this;
  }
}

// Specialized Dashboard Page with Fluent Promise Chaining
class DashboardPage extends BasePage {
  constructor() {
    super('DashboardPage');
  }

  public async clickLoginButton(): Promise<this> {
    console.log('-> Clicked [Login] button');
    return this;
  }

  public async enterUsername(username: string = 'qa_lead'): Promise<this> {
    console.log(\`-> Entered username: "\${username}"\`);
    return this;
  }

  public async enterPassword(password: string = 'SecretPass123!'): Promise<this> {
    console.log(\`-> Entered password: "\${'*'.repeat(password.length)}"\`);
    return this;
  }

  public async submit(): Promise<this> {
    console.log('-> Clicked Submit & Authenticated!');
    return this;
  }
}

// Page Opener Helper
async function open<T extends BasePage>(PageClass: new () => T): Promise<T> {
  console.log('--- Initializing Test Execution Flow ---');
  return new PageClass();
}

// RUN THE CHAINED METHOD EXECUTION:
async function executeChainedTest() {
  let dashboard = await open(DashboardPage)
    .then((_) => _.clickLoginButton())
    .then((_) => _.enterUsername('super_tester'))
    .then((_) => _.enterPassword('AutomationRocks2026'))
    .then((_) => _.submit());

  console.log('=== Test Execution Finished Successfully ===');
}

executeChainedTest();
`
        }
      }
    ],
    playgroundCode: `// Try adding another step to the chain:
class CheckoutPage {
  async addItem(sku: string): Promise<this> {
    console.log(\`Added item: \${sku}\`);
    return this;
  }

  async applyDiscount(coupon: string): Promise<this> {
    console.log(\`Applied coupon: \${coupon}\`);
    return this;
  }

  async verifyTotal(expected: number): Promise<this> {
    console.log(\`Verified total equals: $\${expected}\`);
    return this;
  }
}

async function testCart() {
  const cart = new CheckoutPage();
  await cart
    .addItem('PRO-MAC-16')
    .then((c) => c.applyDiscount('SPRING20'))
    .then((c) => c.verifyTotal(1999.00));
}

testCart();
`
  }
];
