import { test as baseTest, expect, Page } from '@playwright/test';
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
    const client = new ApiClient(request, process.env.API_BASE_URL || 'https://api-staging.enterprise-app.io');
    await use(client);
  },

  // Bound open helper fixture
  open: async ({ page }, use) => {
    const openHelper = async <T extends BasePage>(PageClass: new (p: Page) => T): Promise<T> => {
      const instance = new PageClass(page);
      await instance.navigate();
      await instance.waitForPageReady();
      return instance;
    };
    await use(openHelper);
  },
});

export { expect };
