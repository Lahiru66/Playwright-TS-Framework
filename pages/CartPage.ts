import { Page } from '@playwright/test';

export class CartPage {
  constructor(private readonly page: Page) {}

  async itemNames(): Promise<string[]> {
    return this.page.getByTestId('inventory-item-name').allTextContents();
  }

  async removeItem(name: string) {
    await this.page
      .getByTestId('inventory-item')
      .filter({ hasText: name })
      .getByRole('button', { name: 'Remove' })
      .click();
  }

  async checkout() {
    await this.page.getByRole('button', { name: 'Checkout' }).click();
  }
}
