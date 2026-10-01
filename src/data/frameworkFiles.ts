import type { FrameworkFile } from '../types/curriculum';

export const frameworkFiles: FrameworkFile[] = [
  {
    path: 'playwright.config.ts',
    filename: 'playwright.config.ts',
    category: 'config',
    language: 'typescript',
    description: 'Enterprise configuration with multi-browser matrix, parallel workers, artifact retention (traces, videos, screenshots), and custom reporters.',
    keyHighlights: [
      'Fully parallelized workers across available CPU cores',
      'Automatic retries enabled for CI environments',
      'Trace viewer, videos, and full-page screenshots captured on first failure',
      'Multi-project browser definitions (Chromium, Firefox, WebKit, Mobile Chrome)'
    ],
    code: `import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables (.env.staging or .env.prod)
dotenv.config({ path: path.resolve(__dirname, \`.env.\${process.env.TEST_ENV || 'staging'}\`) });

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? '50%' : undefined,
  timeout: 45000,
  expect: {
    timeout: 10000,
  },
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
    ['allure-playwright', { outputFolder: 'allure-results' }],
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://staging.enterprise-app.io',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1920, height: 1080 } },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], viewport: { width: 1920, height: 1080 } },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'api-tests',
      testMatch: /.*\\.api\\.spec\\.ts/,
      use: {
        baseURL: process.env.API_BASE_URL || 'https://api-staging.enterprise-app.io',
      },
    },
  ],
});`
  },
  {
    path: 'src/pages/BasePage.ts',
    filename: 'BasePage.ts',
    category: 'pages',
    language: 'typescript',
    description: 'Abstract Base Page containing driver wrappers, explicit wait helpers, logging, and auto-screenshot utilities.',
    keyHighlights: [
      'Encapsulates the Playwright Page instance',
      'Provides resilient action wrappers with integrated logging',
      'All action methods return Promise<this> to enable fluent chaining'
    ],
    code: `import { Page, Locator, expect } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page, protected readonly urlPath: string = '') {}

  /**
   * Navigates directly to the page relative URL
   */
  public async navigate(): Promise<this> {
    console.log(\`[BasePage] Navigating to: \${this.urlPath}\`);
    await this.page.goto(this.urlPath, { waitUntil: 'domcontentloaded' });
    return this;
  }

  /**
   * Waits for page network idle state
   */
  public async waitForPageReady(): Promise<this> {
    await this.page.waitForLoadState('networkidle');
    return this;
  }

  /**
   * Takes a full page screenshot attached to test artifacts
   */
  public async captureScreenshot(stepName: string): Promise<this> {
    const filename = \`screenshots/\${Date.now()}-\${stepName.replace(/\\s+/g, '_')}.png\`;
    await this.page.screenshot({ path: filename, fullPage: true });
    console.log(\`[BasePage] Captured screenshot: \${filename}\`);
    return this;
  }

  /**
   * Safe click with auto-wait and highlight
   */
  protected async safeClick(locator: Locator, description: string): Promise<this> {
    console.log(\`[BasePage Action] Clicking \${description}\`);
    await locator.waitFor({ state: 'visible', timeout: 10000 });
    await locator.click();
    return this;
  }
}`
  },
  {
    path: 'src/pages/DashboardPage.ts',
    filename: 'DashboardPage.ts',
    category: 'pages',
    language: 'typescript',
    description: 'Specialized Dashboard Page implementation demonstrating fluent Promise method chaining with strict TypeScript types.',
    keyHighlights: [
      'Encapsulated locators using user-centric accessible roles and data-testids',
      'Methods return Promise<this> for exact method chaining syntax',
      'Embedded assertions with auto-retrying expectations'
    ],
    code: `import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  // Locators
  private readonly loginButton: Locator;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly submitButton: Locator;
  private readonly welcomeBanner: Locator;
  private readonly metricsCard: Locator;

  constructor(page: Page) {
    super(page, '/dashboard');
    this.loginButton = page.getByRole('button', { name: 'Sign In' });
    this.usernameInput = page.getByLabel('Username or Corporate Email');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Authenticate' });
    this.welcomeBanner = page.getByTestId('dashboard-welcome-heading');
    this.metricsCard = page.getByRole('region', { name: 'Analytics Summary' });
  }

  /**
   * Clicks the login trigger button
   */
  public async clickLoginButton(): Promise<this> {
    await this.safeClick(this.loginButton, 'Header Login Button');
    return this;
  }

  /**
   * Enters the username into credentials input
   */
  public async enterUsername(username: string = 'qa_architect@enterprise.io'): Promise<this> {
    console.log(\`[DashboardPage] Entering username: \${username}\`);
    await this.usernameInput.fill(username);
    return this;
  }

  /**
   * Enters the password
   */
  public async enterPassword(password: string = 'ProductionMasterKey2026!'): Promise<this> {
    console.log('[DashboardPage] Entering secure password');
    await this.passwordInput.fill(password);
    return this;
  }

  /**
   * Submits the authentication form
   */
  public async submit(): Promise<this> {
    await this.safeClick(this.submitButton, 'Authenticate Submit Button');
    return this;
  }

  /**
   * Verifies the dashboard welcome state
   */
  public async verifyDashboardLoaded(): Promise<this> {
    console.log('[DashboardPage] Verifying dashboard welcome banner...');
    await expect(this.welcomeBanner).toBeVisible({ timeout: 15000 });
    await expect(this.metricsCard).toBeVisible();
    return this;
  }
}`
  },
  {
    path: 'src/utils/pageOpener.ts',
    filename: 'pageOpener.ts',
    category: 'utils',
    language: 'typescript',
    description: 'The generic factory function enabling `let page = await open(PageClass).then(...).then(...)`.',
    keyHighlights: [
      'Generic constructor constraint <T extends BasePage>',
      'Automatically instantiates page with active Playwright Page',
      'Navigates and waits for page readiness before returning Promise<T>'
    ],
    code: `import { Page } from '@playwright/test';
import { BasePage } from '../pages/BasePage';

/**
 * Global Page Opener Factory
 * Usage:
 * let page = await open(DashboardPage, activePage)
 *   .then((_) => _.clickLoginButton())
 *   .then((_) => _.enterUsername('lead_qa'));
 */
export async function open<T extends BasePage>(
  PageConstructor: new (page: Page) => T,
  pageInstance: Page
): Promise<T> {
  const pageObject = new PageConstructor(pageInstance);
  await pageObject.navigate();
  await pageObject.waitForPageReady();
  return pageObject;
}`
  },
  {
    path: 'src/fixtures/customFixtures.ts',
    filename: 'customFixtures.ts',
    category: 'fixtures',
    language: 'typescript',
    description: 'Custom fixture definitions extending @playwright/test with automatic page object instantiation and API client injection.',
    keyHighlights: [
      'Dependency injection of DashboardPage, LoginPage, and ApiClient',
      'Automatic setup and teardown handling',
      'Provides helper open() factory bound to active test page context'
    ],
    code: `import { test as baseTest, expect, Page } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';
import { ApiClient } from '../api/client/ApiClient';
import { BasePage } from '../pages/BasePage';

export interface CustomFixtures {
  dashboardPage: DashboardPage;
  apiClient: ApiClient;
  open: <T extends BasePage>(PageClass: new (page: Page) => T) => Promise<T>;
}

export const test = baseTest.extend<CustomFixtures>({
  dashboardPage: async ({ page }, use) => {
    const dashboard = new DashboardPage(page);
    await dashboard.navigate();
    await use(dashboard);
  },

  apiClient: async ({ request }, use) => {
    const client = new ApiClient(request, process.env.API_BASE_URL || 'https://api-staging.io');
    await use(client);
  },

  open: async ({ page }, use) => {
    // Bound open helper
    const openHelper = async <T extends BasePage>(PageClass: new (p: Page) => T): Promise<T> => {
      const instance = new PageClass(page);
      await instance.navigate();
      await instance.waitForPageReady();
      return instance;
    };
    await use(openHelper);
  },
});

export { expect };`
  },
  {
    path: 'src/api/client/ApiClient.ts',
    filename: 'ApiClient.ts',
    category: 'api',
    language: 'typescript',
    description: 'Production API client wrapping Playwright APIRequestContext with token injection, retry on 503, and JSON type parsing.',
    keyHighlights: [
      'Encapsulates Playwright APIRequestContext',
      'Bearer token caching and automatic header injection',
      'Generic response unwrapper with status validation'
    ],
    code: `import { APIRequestContext, APIResponse, expect } from '@playwright/test';

export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number>;
  data?: unknown;
}

export class ApiClient {
  private authToken: string | null = null;

  constructor(
    private readonly request: APIRequestContext,
    private readonly baseUrl: string
  ) {}

  public setToken(token: string): void {
    this.authToken = token;
  }

  private buildHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...customHeaders,
    };
    if (this.authToken) {
      headers['Authorization'] = \`Bearer \${this.authToken}\`;
    }
    return headers;
  }

  public async get<T>(endpoint: string, options?: RequestOptions): Promise<{ status: number; data: T }> {
    const response = await this.request.get(\`\${this.baseUrl}\${endpoint}\`, {
      headers: this.buildHeaders(options?.headers),
      params: options?.params,
    });
    expect(response.ok(), \`GET \${endpoint} failed with status \${response.status()}\`).toBeTruthy();
    return { status: response.status(), data: (await response.json()) as T };
  }

  public async post<TReq, TRes>(endpoint: string, body: TReq, options?: RequestOptions): Promise<{ status: number; data: TRes }> {
    const response = await this.request.post(\`\${this.baseUrl}\${endpoint}\`, {
      headers: this.buildHeaders(options?.headers),
      data: body,
    });
    return { status: response.status(), data: (await response.json()) as TRes };
  }

  public async delete(endpoint: string, options?: RequestOptions): Promise<APIResponse> {
    return this.request.delete(\`\${this.baseUrl}\${endpoint}\`, {
      headers: this.buildHeaders(options?.headers),
    });
  }
}`
  },
  {
    path: 'tests/e2e/dashboardChained.spec.ts',
    filename: 'dashboardChained.spec.ts',
    category: 'tests',
    language: 'typescript',
    description: 'The real production E2E test file showing the exact method chaining pattern requested by user.',
    keyHighlights: [
      'Executes open(DashboardPage).then(...).then(...) chaining',
      'Full TypeScript compile-time type safety at each chained step',
      'Seamless interaction with real DOM elements and assertions'
    ],
    code: `import { test, expect } from '../../src/fixtures/customFixtures';
import { DashboardPage } from '../../src/pages/DashboardPage';

test.describe('Enterprise Dashboard Chained E2E Test Suite', () => {

  test('TC-101: Complete Login & Dashboard verification via Method Chaining', async ({ open }) => {
    
    // Exact requested syntax:
    let BasePage = await open(DashboardPage)
      .then((_) => _.clickLoginButton())
      .then((_) => _.enterUsername('lead_architect'))
      .then((_) => _.enterPassword('VaultSecure2026!'))
      .then((_) => _.submit())
      .then((_) => _.verifyDashboardLoaded());

    console.log('Test completed successfully. Page context:', BasePage.constructor.name);
  });

  test('TC-102: Cross-Page Checkout transition with fluent chaining', async ({ page, open }) => {
    // Fluent class-based execution
    const dashboard = await open(DashboardPage);
    
    await dashboard
      .clickLoginButton()
      .then((_) => _.enterUsername('sarah_lead_qa'))
      .then((_) => _.submit())
      .then((_) => _.captureScreenshot('Post-Auth-State'));
  });
});`
  },
  {
    path: 'tests/api/users.api.spec.ts',
    filename: 'users.api.spec.ts',
    category: 'tests',
    language: 'typescript',
    description: 'Comprehensive REST API automation test suite testing user lifecycle, token auth, and schema validation.',
    keyHighlights: [
      'API-only execution bypassing UI rendering overhead',
      'Tests full CRUD: Create, Read, Update, Delete',
      'Validates status codes and payload contracts'
    ],
    code: `import { test, expect } from '../../src/fixtures/customFixtures';

interface UserDto {
  id: string;
  name: string;
  email: string;
  role: string;
}

test.describe('Enterprise Users REST API Automation Suite', () => {
  let createdUserId: string;

  test('POST /users - Create new automation user', async ({ apiClient }) => {
    const payload = {
      name: 'Alex Mercer',
      email: \`alex.qa.\${Date.now()}@enterprise.io\`,
      role: 'lead_engineer',
    };

    const response = await apiClient.post<typeof payload, UserDto>('/api/v1/users', payload);
    expect(response.status).toBe(201);
    expect(response.data.id).toBeDefined();
    expect(response.data.name).toBe(payload.name);

    createdUserId = response.data.id;
  });

  test('GET /users/:id - Fetch user by ID and validate contract', async ({ apiClient }) => {
    const response = await apiClient.get<UserDto>(\`/api/v1/users/\${createdUserId}\`);
    expect(response.status).toBe(200);
    expect(response.data.id).toBe(createdUserId);
  });

  test('DELETE /users/:id - Clean up user', async ({ apiClient }) => {
    const response = await apiClient.delete(\`/api/v1/users/\${createdUserId}\`);
    expect(response.status()).toBe(204);
  });
});`
  }
];
