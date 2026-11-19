import { Locator, Page } from '@playwright/test';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/inventory.html');
  }

  title(): Locator {
    return this.page.getByTestId('title');
  }

  cartBadge(): Locator {
    return this.page.getByTestId('shopping-cart-badge');
  }

  private product(name: string): Locator {
    return this.page.getByTestId('inventory-item').filter({ hasText: name });
  }

  async productNames(): Promise<string[]> {
    return this.page.getByTestId('inventory-item-name').allTextContents();
  }

  async productPrices(): Promise<number[]> {
    const prices = await this.page.getByTestId('inventory-item-price').allTextContents();
    return prices.map((price) => Number(price.replace('$', '')));
  }

  async addToCart(name: string) {
    await this.product(name).getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeFromCart(name: string) {
    await this.product(name).getByRole('button', { name: 'Remove' }).click();
  }

  async sortBy(option: SortOption) {
    await this.page.getByTestId('product-sort-container').selectOption(option);
  }

  async openCart() {
    await this.page.getByTestId('shopping-cart-link').click();
  }

  async logout() {
    await this.page.getByRole('button', { name: 'Open Menu' }).click();
    await this.page.getByRole('button', { name: 'Logout' }).click();
  }
}
