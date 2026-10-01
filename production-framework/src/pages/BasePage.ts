import { Page, Locator, expect } from '@playwright/test';

/**
 * Base Page Object
 * Provides core driver interactions, resilient auto-waiting, logging, and screenshot helpers.
 * Every action method returns Promise<this> to enable fluent Promise chaining.
 */
export abstract class BasePage {
  constructor(
    protected readonly page: Page, 
    protected readonly urlPath: string = ''
  ) {}

  /**
   * Navigates to the page relative path
   */
  public async navigate(): Promise<this> {
    console.log(`[BasePage] Navigating to: ${this.urlPath}`);
    await this.page.goto(this.urlPath, { waitUntil: 'domcontentloaded' });
    return this;
  }

  /**
   * Waits for page to reach networkidle state
   */
  public async waitForPageReady(): Promise<this> {
    await this.page.waitForLoadState('networkidle');
    return this;
  }

  /**
   * Captures full page screenshot for test reporting
   */
  public async captureScreenshot(stepName: string): Promise<this> {
    const filename = `screenshots/${Date.now()}-${stepName.replace(/\s+/g, '_')}.png`;
    await this.page.screenshot({ path: filename, fullPage: true });
    console.log(`[BasePage] Captured screenshot: ${filename}`);
    return this;
  }

  /**
   * Resilient click with auto-wait and highlight
   */
  protected async safeClick(locator: Locator, description: string): Promise<this> {
    console.log(`[BasePage Action] Clicking ${description}`);
    await locator.waitFor({ state: 'visible', timeout: 10000 });
    await locator.click();
    return this;
  }
}
