import { Lesson } from '../types/curriculum';

export const apiLessons: Lesson[] = [
  {
    id: 'pw-api-basics',
    moduleId: 'api',
    title: '1. Playwright API Testing & APIRequestContext',
    subtitle: 'CRUD Operations, Headers, Payloads, and Response Validations',
    readingTime: '20 min',
    level: 'Intermediate',
    tags: ['API Automation', 'APIRequestContext', 'REST API', 'CRUD', 'Assertions'],
    overview: 'Playwright is not just for UI! Playwright comes with a built-in high-performance HTTP client (APIRequestContext). Learn how to write lightning-fast REST API test suites without extra dependencies like Axios or Supertest.',
    keyTakeaways: [
      'Use the `request` fixture provided by Playwright to perform direct HTTP calls.',
      'API tests run 10x-50x faster than UI tests because they bypass browser rendering engines.',
      'Playwright automatically parses JSON, manages cookies, and supports multipart form uploads.'
    ],
    sections: [
      {
        id: 'crud-operations',
        title: 'Full REST API CRUD Implementation in Playwright',
        content: `With \`playwright.request\`, you can issue \`get\`, \`post\`, \`put\`, \`patch\`, and \`delete\` calls with full TypeScript typing.`,
        snippet: {
          title: 'tests/api/users.api.spec.ts',
          language: 'typescript',
          code: `import { test, expect } from '@playwright/test';

interface CreateUserPayload {
  name: string;
  email: string;
  role: 'developer' | 'qa_lead' | 'product_owner';
}

interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

test.describe('Users REST API Suite', () => {
  let createdUserId: string;

  test('POST /api/v1/users - Should create a new user', async ({ request }) => {
    const payload: CreateUserPayload = {
      name: 'Sarah Connor',
      email: \`sarah.qa.\${Date.now()}@cyberdyne.io\`,
      role: 'qa_lead'
    };

    const response = await request.post('https://api.staging.io/api/v1/users', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token-secret'
      },
      data: payload
    });

    // Status assertions
    expect(response.status()).toBe(201);
    expect(response.ok()).toBeTruthy();

    const body: UserResponse = await response.json();
    expect(body.id).toBeDefined();
    expect(body.email).toBe(payload.email);
    expect(body.role).toBe(payload.role);

    createdUserId = body.id;
  });

  test('GET /api/v1/users/:id - Should fetch created user', async ({ request }) => {
    const response = await request.get(\`https://api.staging.io/api/v1/users/\${createdUserId}\`);
    expect(response.status()).toBe(200);

    const body: UserResponse = await response.json();
    expect(body.id).toBe(createdUserId);
  });

  test('DELETE /api/v1/users/:id - Clean up user', async ({ request }) => {
    const response = await request.delete(\`https://api.staging.io/api/v1/users/\${createdUserId}\`);
    expect(response.status()).toBe(204);
  });
});`
        }
      }
    ],
    playgroundCode: `// Try running a simulated API client with TypeScript in-browser:
interface MockApiResponse<T> {
  status: number;
  ok: boolean;
  data: T;
}

class SimulatedApiClient {
  async post<TReq, TRes>(url: string, body: TReq): Promise<MockApiResponse<TRes>> {
    console.log(\`[HTTP POST] \${url}\`);
    console.log('Request Payload:', body);
    
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 150));
    
    const responseData = {
      id: 'USR-' + Math.floor(Math.random() * 9000 + 1000),
      ...(body as object),
      createdAt: new Date().toISOString()
    } as unknown as TRes;

    return {
      status: 201,
      ok: true,
      data: responseData
    };
  }
}

async function testApiExecution() {
  const client = new SimulatedApiClient();
  const resp = await client.post('/api/v1/auth/tokens', {
    clientId: 'qa-automation-runner',
    scopes: ['read:users', 'write:users']
  });

  console.log('HTTP Status:', resp.status);
  console.log('Response Body:', resp.data);
}

testApiExecution();
`
  },
  {
    id: 'pw-api-hybrid-testing',
    moduleId: 'api',
    title: '2. Hybrid UI + API Testing & Schema Validation',
    subtitle: 'Blazing Fast Test Data Setup via API and Schema Contracts with Zod',
    readingTime: '22 min',
    level: 'Production',
    tags: ['Hybrid Testing', 'Zod', 'Schema Validation', 'storageState', 'Speed Optimization'],
    overview: 'Learn the industry golden standard: Use API calls to prepare prerequisites (create products, seed database) in 50ms, perform the critical UI user actions in the browser, and tear down data via API.',
    keyTakeaways: [
      'Never use the browser UI to set up test preconditions (e.g. registration, adding items to cart); do it via API.',
      'Hybrid testing reduces execution time by 70% and drastically lowers test flakiness.',
      'Schema validation using Zod or AJV ensures backend payload contracts do not break frontend expectations.'
    ],
    sections: [
      {
        id: 'hybrid-pattern',
        title: 'The Hybrid UI + API Pattern in Practice',
        content: `### The Problem with 100% UI Testing
Suppose you want to test the Checkout page.
- In a pure UI test: You must navigate to Login -> enter credentials -> search for product -> click product -> select size -> click Add to Cart -> go to Cart -> click Checkout.
- Result: 45 seconds per test, and any locator failure along the way fails the checkout test!

### The Hybrid Solution
1. Call \`request.post('/api/cart/add')\` directly using the API context (takes 40ms!).
2. Navigate the browser directly to \`/checkout\`.
3. Test ONLY the checkout interactions.
4. Total test time: 3 seconds!`,
        snippet: {
          title: 'Hybrid Test Example (Seed via API -> Test on UI)',
          language: 'typescript',
          code: `import { test, expect } from '@playwright/test';

test('Hybrid Checkout Test: Seed cart via API, verify UI', async ({ page, request }) => {
  // Step 1: Seed test data directly via API in 50ms!
  const cartResponse = await request.post('https://app.staging.io/api/v1/cart/items', {
    data: {
      productId: 'PROD-MACBOOK-16',
      quantity: 1
    }
  });
  expect(cartResponse.ok()).toBeTruthy();

  // Step 2: Open Browser directly on Checkout page (bypass 10 UI steps!)
  await page.goto('https://app.staging.io/checkout');

  // Step 3: Assert cart item is rendered in DOM
  const itemRow = page.getByRole('row', { name: 'PROD-MACBOOK-16' });
  await expect(itemRow).toBeVisible();

  // Step 4: Complete UI payment submission
  await page.getByRole('button', { name: 'Complete Purchase' }).click();
  await expect(page.getByText('Thank you for your order!')).toBeVisible();
});`
        }
      }
    ],
    playgroundCode: `// Try validating an API payload structure in TypeScript:
interface UserSchema {
  id: string;
  email: string;
  age: number;
}

function validateUserPayload(payload: unknown): payload is UserSchema {
  if (typeof payload !== 'object' || payload === null) return false;
  const p = payload as Record<string, unknown>;
  return (
    typeof p.id === 'string' &&
    typeof p.email === 'string' &&
    typeof p.age === 'number'
  );
}

const sample1 = { id: 'USR-1', email: 'test@io.com', age: 28 };
const sample2 = { id: 'USR-2', email: 'invalid@io.com', age: 'twenty' };

console.log('Sample 1 Valid:', validateUserPayload(sample1)); // true
console.log('Sample 2 Valid:', validateUserPayload(sample2)); // false
`
  }
];
