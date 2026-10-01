# Enterprise Playwright + TypeScript Automation Framework

A production-grade, enterprise test automation framework built with **Playwright**, **TypeScript**, and the **Page Object Model (POM)** featuring **asynchronous method chaining** and **API automation testing**.

---

## 🌟 Key Architecture Highlights

1. **Fluent Asynchronous Method Chaining**:
   Tests execute with readable, step-by-step promise chaining:
   ```typescript
   let BasePage = await open(DashboardPage)
     .then((_) => _.clickLoginButton())
     .then((_) => _.enterUsername('lead_architect'))
     .then((_) => _.enterPassword('VaultSecure2026!'))
     .then((_) => _.submit())
     .then((_) => _.verifyDashboardLoaded());
   ```

2. **Generic Page Opener Factory (`open<T extends BasePage>`)**:
   Enables instantiating, navigating, and verifying page readiness with 100% strict TypeScript types and IDE IntelliSense.

3. **Built-in REST API Automation Testing**:
   Native `APIRequestContext` integration in `ApiClient` for blazing-fast CRUD operations, auth token injection, and hybrid UI+API workflows.

4. **Custom Fixtures & Dependency Injection (`test.extend`)**:
   Isolates page instances per worker with zero state leakage and automatic teardown.

---

## 📂 Project Directory Structure

```text
production-framework/
├── playwright.config.ts            # Enterprise configuration
├── src/
│   ├── pages/
│   │   ├── BasePage.ts             # Abstract page object with driver wrappers
│   │   └── DashboardPage.ts        # Chained POM implementation
│   ├── utils/
│   │   └── pageOpener.ts           # Generic open() factory
│   ├── fixtures/
│   │   └── customFixtures.ts       # Extended test fixtures
│   └── api/
│       └── client/
│           └── ApiClient.ts        # API client wrapper
└── tests/
    ├── e2e/
    │   └── dashboardChained.spec.ts # Chained UI test suite
    └── api/
        └── users.api.spec.ts       # REST API CRUD test suite
```

---

## 🚀 Running Tests

```bash
# Run all tests
npx playwright test

# Run UI tests with interactive headed browser
npx playwright test --project=chromium --headed

# Run API tests only
npx playwright test --project=api-tests

# Open Playwright HTML Report
npx playwright show-report
```
