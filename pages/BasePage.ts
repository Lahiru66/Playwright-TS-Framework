import { Locator, Page } from '@playwright/test';

/** Behaviour shared by every page object. Extend it; do not instantiate it. */
export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  /** Navigates to a path relative to the configured baseURL. */
  protected async open(path: string) {
    await this.page.goto(path);
  }

  /** The application's error banner, shown on login and checkout validation failures. */
  errorMessage(): Locator {
    return this.page.getByTestId('error');
  }
}
