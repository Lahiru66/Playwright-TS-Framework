import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  async goto() {
    await this.open('/');
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
}
