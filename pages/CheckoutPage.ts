import { Locator, Page } from '@playwright/test';

export interface Customer {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export class CheckoutPage {
  constructor(private readonly page: Page) {}

  /** Fills the customer information form; missing fields are left blank. */
  async fillInformation(customer: Partial<Customer>) {
    await this.page.getByPlaceholder('First Name').fill(customer.firstName ?? '');
    await this.page.getByPlaceholder('Last Name').fill(customer.lastName ?? '');
    await this.page.getByPlaceholder('Zip/Postal Code').fill(customer.postalCode ?? '');
  }

  async continue() {
    await this.page.getByRole('button', { name: 'Continue' }).click();
  }

  async finish() {
    await this.page.getByRole('button', { name: 'Finish' }).click();
  }

  errorMessage(): Locator {
    return this.page.getByTestId('error');
  }

  confirmationHeading(): Locator {
    return this.page.getByRole('heading', { name: 'Thank you for your order!' });
  }
}
