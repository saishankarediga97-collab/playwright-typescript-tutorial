import { test, expect } from '../../src/fixtures/customFixtures';
import { DashboardPage } from '../../src/pages/DashboardPage';

test.describe('Enterprise Dashboard Chained E2E Test Suite', () => {

  test('TC-101: Complete Login & Dashboard Verification via Method Chaining', async ({ open }) => {
    
    // Exact requested syntax:
    let BasePage = await open(DashboardPage)
      .then((_) => _.clickLoginButton())
      .then((_) => _.enterUsername('lead_architect'))
      .then((_) => _.enterPassword('VaultSecure2026!'))
      .then((_) => _.submit())
      .then((_) => _.verifyDashboardLoaded());

    console.log('Chained POM Test execution passed. Resulting Page:', BasePage.constructor.name);
  });

  test('TC-102: Fluent chained flow with screenshot artifact', async ({ open }) => {
    let dashboard = await open(DashboardPage)
      .then((_) => _.clickLoginButton())
      .then((_) => _.enterUsername('sarah_lead_qa'))
      .then((_) => _.enterPassword('Automation2026!'))
      .then((_) => _.submit())
      .then((_) => _.captureScreenshot('Post-Login-State'));

    console.log('Screenshot captured for:', dashboard.constructor.name);
  });
});
