import { test, expect } from '../fixtures';
import { env } from '../config/env';
import { testData } from '../test-data';

const { users, products, customer } = testData.shop;

// Sauce Demo lives on a different host than the default baseURL.
test.use({ baseURL: env.shopUrl });

test.describe('Sauce Demo: login', () => {
  test('logs in a standard user and shows the product list', { tag: '@smoke' }, async ({
    loginPage,
    inventoryPage,
    page,
  }) => {
    await loginPage.goto();
    await loginPage.login(users.standard);
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.title()).toHaveText('Products');
    expect((await inventoryPage.productNames()).length).toBeGreaterThan(0);
  });

  test('blocks a locked-out user with an error', { tag: '@regression' }, async ({
    loginPage,
    page,
  }) => {
    await loginPage.goto();
    await loginPage.login(users.lockedOut);
    await expect(loginPage.errorMessage()).toContainText('this user has been locked out');
    await expect(page).not.toHaveURL(/inventory\.html/);
  });

  test('rejects a wrong password', { tag: '@regression' }, async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(users.wrongPassword);
    await expect(loginPage.errorMessage()).toContainText(
      'Username and password do not match any user',
    );
  });

  test('requires a username', { tag: '@regression' }, async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.submitEmpty();
    await expect(loginPage.errorMessage()).toContainText('Username is required');
  });

  test('redirects an anonymous visitor away from the product list', {
    tag: '@regression',
  }, async ({ inventoryPage, loginPage, page }) => {
    await inventoryPage.goto();
    await expect(page).not.toHaveURL(/inventory\.html/);
    await expect(loginPage.errorMessage()).toContainText('only access');
  });

  test('logs out back to the login page', { tag: '@regression' }, async ({
    loggedInInventory,
    loginPage,
    page,
  }) => {
    await loggedInInventory.logout();
    await expect(page).not.toHaveURL(/inventory\.html/);
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    await expect(loginPage.errorMessage()).toBeHidden();
  });
});

test.describe('Sauce Demo: products and cart', () => {
  test('shows the cart count after adding a product', { tag: '@regression' }, async ({
    loggedInInventory,
  }) => {
    await loggedInInventory.addToCart(products.backpack);
    await expect(loggedInInventory.cartBadge()).toHaveText('1');
    await loggedInInventory.addToCart(products.bikeLight);
    await expect(loggedInInventory.cartBadge()).toHaveText('2');
  });

  test('lists the added products in the cart', { tag: '@regression' }, async ({
    loggedInInventory,
    cartPage,
  }) => {
    await loggedInInventory.addToCart(products.backpack);
    await loggedInInventory.addToCart(products.bikeLight);
    await loggedInInventory.openCart();
    expect(await cartPage.itemNames()).toEqual([products.backpack, products.bikeLight]);
  });

  test('removes a product from the cart', { tag: '@regression' }, async ({
    loggedInInventory,
    cartPage,
  }) => {
    await loggedInInventory.addToCart(products.backpack);
    await loggedInInventory.addToCart(products.bikeLight);
    await loggedInInventory.openCart();
    await cartPage.removeItem(products.backpack);
    await expect.poll(() => cartPage.itemNames()).toEqual([products.bikeLight]);
  });

  test('sorts products by price from low to high', { tag: '@regression' }, async ({
    loggedInInventory,
  }) => {
    await loggedInInventory.sortBy('lohi');
    const prices = await loggedInInventory.productPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('sorts products by name from Z to A', { tag: '@regression' }, async ({
    loggedInInventory,
  }) => {
    await loggedInInventory.sortBy('za');
    const names = await loggedInInventory.productNames();
    expect(names).toEqual([...names].sort().reverse());
  });
});

test.describe('Sauce Demo: checkout', () => {
  test('completes an order end to end', { tag: '@smoke' }, async ({
    loggedInInventory,
    cartPage,
    checkoutPage,
  }) => {
    await loggedInInventory.addToCart(products.backpack);
    await loggedInInventory.openCart();
    await cartPage.checkout();
    await checkoutPage.fillInformation(customer);
    await checkoutPage.continue();
    await checkoutPage.finish();
    await expect(checkoutPage.confirmationHeading()).toBeVisible();
  });

  test('requires a first name to continue', { tag: '@regression' }, async ({
    loggedInInventory,
    cartPage,
    checkoutPage,
  }) => {
    await loggedInInventory.addToCart(products.backpack);
    await loggedInInventory.openCart();
    await cartPage.checkout();
    await checkoutPage.fillInformation({ ...customer, firstName: '' });
    await checkoutPage.continue();
    await expect(checkoutPage.errorMessage()).toContainText('First Name is required');
  });
});
