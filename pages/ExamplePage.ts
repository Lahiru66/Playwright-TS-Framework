import { Page } from '@playwright/test';

export class ExamplePage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('https://example.com');
  }

  async title() {
    return this.page.title();
  }
}
