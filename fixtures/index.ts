import { test as base } from '@playwright/test';
import { ExamplePage } from '../pages/ExamplePage';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { testData } from '../test-data';

interface Fixtures {
  examplePage: ExamplePage;
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  /** Inventory page after logging in as the standard user (fresh session per test). */
  loggedInInventory: InventoryPage;
}

export const test = base.extend<Fixtures>({
  examplePage: async ({ page }, use) => {
    await use(new ExamplePage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  loggedInInventory: async ({ page, loginPage, inventoryPage }, use) => {
    await loginPage.goto();
    await loginPage.login(testData.shop.users.standard);
    await page.waitForURL('**/inventory.html');
    await use(inventoryPage);
  },
});

export { expect } from '@playwright/test';
