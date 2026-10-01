import { Page } from '@playwright/test';
import { BasePage } from '../pages/BasePage';

/**
 * Generic Page Opener Factory
 * Allows writing tests with fluent Promise chaining:
 * 
 * let BasePage = await open(DashboardPage, page)
 *   .then((_) => _.clickLoginButton())
 *   .then((_) => _.enterUsername())
 *   .then((_) => _.enterPassword())
 *   .then((_) => _.submit())
 */
export async function open<T extends BasePage>(
  PageConstructor: new (page: Page) => T,
  driver: Page
): Promise<T> {
  const pageInstance = new PageConstructor(driver);
  await pageInstance.navigate();
  await pageInstance.waitForPageReady();
  return pageInstance;
}
