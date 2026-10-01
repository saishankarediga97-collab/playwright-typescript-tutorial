import type { Lesson } from '../types/curriculum';

export const playwrightLessons: Lesson[] = [
  {
    id: 'pw-architecture',
    moduleId: 'playwright',
    title: '1. Playwright Core Architecture & Modern Locators',
    subtitle: 'Browser, BrowserContext, Page, Auto-Waiting, and Resilient Locators',
    readingTime: '18 min',
    level: 'Intermediate',
    tags: ['Playwright', 'Locators', 'Auto-Waiting', 'BrowserContext', 'Assertions'],
    overview: 'Understand Playwright\'s architecture. Learn why BrowserContext provides multi-tab, multi-user isolation in milliseconds without overhead, and master user-facing locators with auto-waiting.',
    keyTakeaways: [
      'Playwright communicates with browsers via a single WebSocket connection over Chrome DevTools Protocol (CDP) / Firefox / WebKit.',
      'BrowserContexts are isolated incognito sessions created in milliseconds, allowing parallel multi-role testing.',
      'Prefer user-facing locators (getByRole, getByLabel, getByTestId) over brittle CSS/XPath.',
      'Playwright automatically waits for elements to be visible, enabled, and stable before performing actions.'
    ],
    sections: [
      {
        id: 'pw-locators-matrix',
        title: 'Modern Locators & Auto-Waiting Mechanics',
        content: `Traditional automation tools like Selenium required arbitrary \`Thread.sleep()\` or explicit WebDriverWait boilerplate.
Playwright introduces **Actionability Checks**: before clicking or typing, Playwright automatically ensures the target element is:
1. Attached to the DOM
2. Visible
3. Stable (not animating)
4. Receives pointer events (not obscured by modals/loaders)
5. Enabled`,
        snippet: {
          title: 'User-Facing Locators & Web-First Assertions',
          language: 'typescript',
          code: `import { test, expect } from '@playwright/test';

test('Verify modern locators and auto-waiting', async ({ page }) => {
  await page.goto('https://ecommerce.staging.io/login');

  // Modern Accessible Locators
  await page.getByLabel('Work Email').fill('lead.qa@company.com');
  await page.getByLabel('Password').fill('SecurePassword123!');
  await page.getByRole('button', { name: 'Sign in to Dashboard' }).click();

  // Web-First Assertion with built-in auto-retry
  const welcomeHeading = page.getByRole('heading', { name: 'Welcome back, Lead QA' });
  await expect(welcomeHeading).toBeVisible({ timeout: 10000 });
  
  // Filtering locators
  const adminCard = page.getByRole('listitem').filter({ hasText: 'Admin Settings' });
  await expect(adminCard).toBeEnabled();
});`
        }
      }
    ],
    playgroundCode: `// Try running a simulated Playwright locator resolution engine:
class SimulatedLocator {
  constructor(public selector: string, private visible = true) {}

  async click(): Promise<void> {
    console.log(\`[Auto-Wait] Checking visibility of: \${this.selector} ...\`);
    await new Promise((r) => setTimeout(r, 100));
    if (!this.visible) throw new Error(\`Element \${this.selector} not visible!\`);
    console.log(\`[Action] CLICKED element: \${this.selector}\`);
  }

  async fill(text: string): Promise<void> {
    console.log(\`[Action] TYPED "\${text}" into: \${this.selector}\`);
  }
}

async function runLocatorTest() {
  const emailInput = new SimulatedLocator('input#email');
  const submitBtn = new SimulatedLocator('button[type="submit"]');

  await emailInput.fill('tester@production.io');
  await submitBtn.click();
  console.log('Playwright action completed cleanly!');
}

runLocatorTest();
`
  },
  {
    id: 'pw-pom-method-chaining',
    moduleId: 'playwright',
    title: '2. Page Object Model (POM) & Asynchronous Method Chaining',
    subtitle: 'The Exact open(Page).then(...).then(...) Pattern for Production Frameworks',
    readingTime: '26 min',
    level: 'Production',
    tags: ['POM', 'Method Chaining', 'open(Page)', 'Promise Chaining', 'Fluent API'],
    overview: 'Master the Page Object Model (POM) with fluent method chaining. Learn how to construct the generic open(PageClass) factory and write readable test steps using promise chaining.',
    keyTakeaways: [
      'POM encapsulates page locators and user interactions, preventing test duplication.',
      'Returning `Promise<this>` from every page action allows seamless `.then((_) => _...)` promise chaining.',
      'The generic `open<T extends BasePage>(pageClass: new (page: Page) => T): Promise<T>` instantiates and navigates to the page automatically.',
      'This pattern provides pristine IntelliSense autocomplete in VS Code and IDEs at every chained step.'
    ],
    sections: [
      {
        id: 'chaining-pattern-breakdown',
        title: 'The Production Chaining Pattern Explained',
        content: `You asked for tests that execute with this exact syntax:
\`\`\`typescript
let BasePage = await open(DashboardPage)
  .then((_) => _.clickLoginButton())
  .then((_) => _.enterUsername())
  .then((_) => _.enterPassword())
\`\`\`

### How Does This Work Under the Hood?
1. **The \`open()\` Helper**:
   Takes a class constructor \`PageClass\`, instantiates it with the Playwright \`page\` fixture, navigates to its URL, and returns \`Promise<T>\`.
2. **The \`_ (underscore)\` in \`.then((_) => ...)\`**:
   The resolved value of the previous Promise (the page instance!) is passed to the arrow function argument \`_\`.
3. **Returning \`this\` from Page Methods**:
   Every action method returns \`this\` (or \`Promise<this>\`). This ensures that the next \`.then()\` in the chain receives the exact same Page Object with full TypeScript autocomplete!`,
        callout: {
          type: 'production',
          title: 'Senior Architect Insight',
          text: 'Notice that in TypeScript, returning `Promise<this>` guarantees that the type of `_` inside `.then((_) => ...)` is strictly inferred as the current Page class! You get 100% compile-time autocomplete and safety.'
        },
        snippet: {
          title: 'Real-Time Implementation: BasePage, DashboardPage & Chaining',
          language: 'typescript',
          runnable: true,
          code: `// --- 1. MOCK PLAYWRIGHT PAGE & LOCATOR INTERFACES ---
interface PlaywrightPage {
  goto(url: string): Promise<void>;
  click(selector: string): Promise<void>;
  fill(selector: string, value: string): Promise<void>;
  locator(selector: string): { isVisible(): Promise<boolean> };
}

// Simulated browser page
const mockPage: PlaywrightPage = {
  async goto(url) { console.log(\`[Browser] Navigating to: \${url}\`); },
  async click(sel) { console.log(\`[DOM] Clicked: \${sel}\`); },
  async fill(sel, val) { console.log(\`[DOM] Filled \${sel} with "\${val}"\`); },
  locator(sel) { return { async isVisible() { return true; } }; }
};

// --- 2. BASE PAGE ABSTRACT CLASS ---
abstract class BasePage {
  constructor(protected page: PlaywrightPage, protected urlPath: string) {}

  public async navigate(): Promise<this> {
    await this.page.goto(\`https://portal.enterprise.io\${this.urlPath}\`);
    return this;
  }

  public async waitForPageLoad(): Promise<this> {
    console.log(\`[Wait] Page \${this.urlPath} loaded & network idle.\`);
    return this;
  }
}

// --- 3. SPECIALIZED DASHBOARD PAGE ---
class DashboardPage extends BasePage {
  // Locators
  private readonly loginButton = 'button[data-testid="header-login-btn"]';
  private readonly usernameInput = 'input#username';
  private readonly passwordInput = 'input#password';
  private readonly submitButton = 'button[type="submit"]';
  private readonly welcomeBanner = '.dashboard-welcome';

  constructor(page: PlaywrightPage) {
    super(page, '/dashboard');
  }

  public async clickLoginButton(): Promise<this> {
    await this.page.click(this.loginButton);
    return this;
  }

  public async enterUsername(username: string = 'senior_qa_lead'): Promise<this> {
    await this.page.fill(this.usernameInput, username);
    return this;
  }

  public async enterPassword(password: string = 'SecureTest123!'): Promise<this> {
    await this.page.fill(this.passwordInput, password);
    return this;
  }

  public async submit(): Promise<this> {
    await this.page.click(this.submitButton);
    console.log('[Auth] Login form submitted successfully!');
    return this;
  }

  public async verifyDashboardLoaded(): Promise<this> {
    const isVisible = await this.page.locator(this.welcomeBanner).isVisible();
    console.log('[Assert] Dashboard Welcome banner visible:', isVisible);
    return this;
  }
}

// --- 4. GENERIC OPEN HELPER ---
async function open<T extends BasePage>(
  PageClass: new (page: PlaywrightPage) => T,
  driver: PlaywrightPage = mockPage
): Promise<T> {
  const instance = new PageClass(driver);
  await instance.navigate();
  await instance.waitForPageLoad();
  return instance;
}

// --- 5. EXECUTION WITH EXACT CHAINING SYNTAX ---
async function runPlaywrightChainedTest() {
  console.log('=== STARTING CHAINED PLAYWRIGHT TEST ===');
  
  let BasePage = await open(DashboardPage)
    .then((_) => _.clickLoginButton())
    .then((_) => _.enterUsername('lead_architect'))
    .then((_) => _.enterPassword('ProductionVault2026!'))
    .then((_) => _.submit())
    .then((_) => _.verifyDashboardLoaded());

  console.log('=== TEST SUITE COMPLETED SUCCESSFULLY ===');
}

runPlaywrightChainedTest();
`
        }
      },
      {
        id: 'cross-page-chaining',
        title: 'Cross-Page Chaining (Transitions Between Pages)',
        content: `What happens when clicking a button navigates to a **new Page Object** (e.g. clicking Checkout on CartPage navigates to PaymentPage)?
Instead of returning \`Promise<this>\`, the method returns \`Promise<NextPage>\`!`,
        snippet: {
          title: 'Cross-Page Transitions with Fluent Promises',
          language: 'typescript',
          runnable: true,
          code: `class OrderConfirmationPage {
  constructor(private orderId: string = 'ORD-9842') {}
  async verifyOrderNumber(): Promise<this> {
    console.log(\`[Assertion] Confirmed Order Number: \${this.orderId}\`);
    return this;
  }
}

class CheckoutPage {
  async fillShippingDetails(): Promise<this> {
    console.log('[Checkout] Filled shipping address.');
    return this;
  }

  // Transitions to OrderConfirmationPage!
  async placeOrder(): Promise<OrderConfirmationPage> {
    console.log('[Checkout] Clicked [Place Order]. Transitioning to confirmation...');
    return new OrderConfirmationPage();
  }
}

async function testCheckoutFlow() {
  const checkout = new CheckoutPage();
  
  // Notice type transitions from CheckoutPage -> OrderConfirmationPage!
  await checkout
    .fillShippingDetails()
    .then((p) => p.placeOrder())
    .then((conf) => conf.verifyOrderNumber());
}

testCheckoutFlow();
`
        }
      }
    ],
    playgroundCode: `// Try modifying the chained steps below:
class SearchResultsPage {
  async filterByBrand(brand: string): Promise<this> {
    console.log(\`Filtered by brand: \${brand}\`);
    return this;
  }
  async selectFirstResult(): Promise<this> {
    console.log('Selected first search result.');
    return this;
  }
  async addToWishlist(): Promise<this> {
    console.log('Saved item to wishlist.');
    return this;
  }
}

async function testSearch() {
  const page = new SearchResultsPage();
  await page
    .filterByBrand('Apple')
    .then((_) => _.selectFirstResult())
    .then((_) => _.addToWishlist());
}

testSearch();
`
  },
  {
    id: 'pw-fixtures-framework',
    moduleId: 'playwright',
    title: '3. Production Framework Architecture & Custom Fixtures',
    subtitle: 'Dependency Injection, Parallel Workers, Custom Reporters, and CI/CD Config',
    readingTime: '24 min',
    level: 'Production',
    tags: ['Fixtures', 'playwright.config.ts', 'Parallelism', 'Allure', 'CI/CD'],
    overview: 'Learn how enterprise companies structure high-scale test repositories with 500+ tests running concurrently across distributed cloud grids using custom fixtures and environment matrixing.',
    keyTakeaways: [
      'Playwright Fixtures provide Dependency Injection (DI): each test receives its isolated page objects automatically.',
      'Fixtures have setup and teardown phases using the `await use(...)` syntax.',
      'Parallel workers run tests in isolated processes with zero state leakage.'
    ],
    sections: [
      {
        id: 'custom-fixture-code',
        title: 'Custom Fixtures with test.extend<T>()',
        content: `In a production framework, you never instantiate page objects manually in every single test file.
Instead, you extend Playwright's \`test\` object with custom fixtures. When a test asks for \`dashboardPage\`, Playwright automatically prepares the page, initializes \`new DashboardPage(page)\`, runs the test, and tears it down afterwards!`,
        snippet: {
          title: 'Enterprise Fixture Setup (fixtures/baseTest.ts)',
          language: 'typescript',
          code: `import { test as baseTest, expect } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/LoginPage';
import { ApiClient } from '../api/ApiClient';

// 1. Declare fixture types
interface CustomFixtures {
  dashboardPage: DashboardPage;
  loginPage: LoginPage;
  apiClient: ApiClient;
}

// 2. Extend base test with custom page object fixtures
export const test = baseTest.extend<CustomFixtures>({
  dashboardPage: async ({ page }, use) => {
    // Setup Phase
    const dashboard = new DashboardPage(page);
    await dashboard.navigate();
    
    // Provide to test
    await use(dashboard);
    
    // Teardown Phase (runs automatically after test!)
    console.log('[Teardown] Dashboard test finished, collecting metrics.');
  },

  loginPage: async ({ page }, use) => {
    const login = new LoginPage(page);
    await use(login);
  },

  apiClient: async ({ request }, use) => {
    const api = new ApiClient(request, process.env.API_BASE_URL!);
    await use(api);
  },
});

export { expect };`
        }
      },
      {
        id: 'chained-fixture-test',
        title: 'Using Chained POM with Custom Fixtures in a Spec File',
        content: `Here is how a real production test looks, combining the custom fixture with the chained \`.then((_) => ...)\` execution:`,
        snippet: {
          title: 'tests/e2e/dashboardChained.spec.ts',
          language: 'typescript',
          code: `import { test, expect } from '../../fixtures/baseTest';

test.describe('Enterprise Dashboard Chained E2E Suite', () => {
  test('Complete login and widget verification with chained promises', async ({ dashboardPage }) => {
    
    // Execute test using fluent promise chaining!
    await dashboardPage
      .clickLoginButton()
      .then((_) => _.enterUsername('lead_architect'))
      .then((_) => _.enterPassword('ProductionVault2026!'))
      .then((_) => _.submit())
      .then((_) => _.verifyDashboardLoaded());

    console.log('Chained E2E Test execution validated.');
  });
});`
        }
      }
    ],
    playgroundCode: `// Try simulating Playwright fixture dependency injection:
interface FixtureContext {
  browserName: string;
  viewport: { width: number; height: number };
}

async function runWithFixture(
  testFn: (ctx: FixtureContext) => Promise<void>
) {
  const ctx: FixtureContext = {
    browserName: 'chromium-headless',
    viewport: { width: 1920, height: 1080 }
  };
  console.log('[Fixture Setup] Initialized context:', ctx);
  await testFn(ctx);
  console.log('[Fixture Teardown] Context destroyed.');
}

runWithFixture(async (ctx) => {
  console.log(\`Running test on \${ctx.browserName} with resolution \${ctx.viewport.width}x\${ctx.viewport.height}\`);
});
`
  }
];
