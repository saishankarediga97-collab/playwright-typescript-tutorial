import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * DashboardPage Object
 * Demonstrates async method chaining:
 * await open(DashboardPage).then(_ => _.clickLoginButton()).then(_ => _.enterUsername())...
 */
export class DashboardPage extends BasePage {
  // Encapsulated Locators
  private readonly loginButton: Locator;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly submitButton: Locator;
  private readonly welcomeBanner: Locator;
  private readonly metricsCard: Locator;

  constructor(page: Page) {
    super(page, '/dashboard');
    this.loginButton = page.getByRole('button', { name: 'Sign In' });
    this.usernameInput = page.getByLabel('Corporate Email');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Authenticate' });
    this.welcomeBanner = page.getByTestId('welcome-heading');
    this.metricsCard = page.getByRole('region', { name: 'Analytics Summary' });
  }

  /**
   * Clicks the login trigger button
   */
  public async clickLoginButton(): Promise<this> {
    await this.safeClick(this.loginButton, 'Sign In Button');
    return this;
  }

  /**
   * Enters username / email
   */
  public async enterUsername(username: string = 'qa_architect@enterprise.io'): Promise<this> {
    console.log(`[DashboardPage] Entering username: ${username}`);
    await this.usernameInput.fill(username);
    return this;
  }

  /**
   * Enters password
   */
  public async enterPassword(password: string = 'ProductionMasterKey2026!'): Promise<this> {
    console.log('[DashboardPage] Entering masked password');
    await this.passwordInput.fill(password);
    return this;
  }

  /**
   * Submits authentication form
   */
  public async submit(): Promise<this> {
    await this.safeClick(this.submitButton, 'Authenticate Submit Button');
    return this;
  }

  /**
   * Verifies dashboard welcome state
   */
  public async verifyDashboardLoaded(): Promise<this> {
    console.log('[DashboardPage] Verifying dashboard welcome banner...');
    await expect(this.welcomeBanner).toBeVisible({ timeout: 15000 });
    return this;
  }
}
