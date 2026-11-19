import { Locator, Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/');
  }

  async login(user: { username: string; password: string }) {
    await this.page.getByPlaceholder('Username').fill(user.username);
    await this.page.getByPlaceholder('Password').fill(user.password);
    await this.page.getByRole('button', { name: 'Login' }).click();
  }

  /** Submits the form without filling any field. */
  async submitEmpty() {
    await this.page.getByRole('button', { name: 'Login' }).click();
  }

  errorMessage(): Locator {
    return this.page.getByTestId('error');
  }
}
