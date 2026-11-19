import { test as base, expect, APIRequestContext, APIResponse } from '@playwright/test';
import { env } from '../config/env';

export interface Booking {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: { checkin: string; checkout: string };
  additionalneeds?: string;
}

const JSON_HEADERS = { 'Content-Type': 'application/json', Accept: 'application/json' };

/**
 * Thin client for the Restful-Booker API (https://restful-booker.herokuapp.com).
 * Bookings created through `createBooking` are deleted automatically after the test.
 */
export class BookerClient {
  private token?: string;
  private readonly createdIds: number[] = [];

  constructor(private readonly request: APIRequestContext) {}

  private url(path: string) {
    return `${env.bookingApiUrl}${path}`;
  }

  /** Public demo credentials of Restful-Booker; override via env vars if needed. */
  credentials() {
    return {
      username: process.env.BOOKER_USERNAME ?? 'admin',
      password: process.env.BOOKER_PASSWORD ?? 'password123',
    };
  }

  authRequest(credentials: { username: string; password: string }) {
    return this.request.post(this.url('/auth'), { headers: JSON_HEADERS, data: credentials });
  }

  async getToken() {
    if (!this.token) {
      const response = await this.authRequest(this.credentials());
      expect(response.status()).toBe(200);
      this.token = (await response.json()).token;
    }
    return this.token!;
  }

  async createBooking(booking: Booking): Promise<{ bookingid: number; booking: Booking }> {
    const response = await this.request.post(this.url('/booking'), {
      headers: JSON_HEADERS,
      data: booking,
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    this.createdIds.push(body.bookingid);
    return body;
  }

  listBookings(): Promise<APIResponse> {
    return this.request.get(this.url('/booking'), { headers: JSON_HEADERS });
  }

  getBooking(id: number): Promise<APIResponse> {
    return this.request.get(this.url(`/booking/${id}`), { headers: JSON_HEADERS });
  }

  async updateBooking(id: number, booking: Booking, authenticated = true) {
    const headers = authenticated
      ? { ...JSON_HEADERS, Cookie: `token=${await this.getToken()}` }
      : JSON_HEADERS;
    return this.request.put(this.url(`/booking/${id}`), { headers, data: booking });
  }

  async patchBooking(id: number, changes: Partial<Booking>) {
    return this.request.patch(this.url(`/booking/${id}`), {
      headers: { ...JSON_HEADERS, Cookie: `token=${await this.getToken()}` },
      data: changes,
    });
  }

  async deleteBooking(id: number) {
    return this.request.delete(this.url(`/booking/${id}`), {
      headers: { ...JSON_HEADERS, Cookie: `token=${await this.getToken()}` },
    });
  }

  /** Best-effort cleanup of everything this test created. */
  async cleanup() {
    for (const id of this.createdIds) {
      await this.deleteBooking(id).catch(() => undefined);
    }
  }
}

export const test = base.extend<{ booker: BookerClient }>({
  booker: async ({ request }, use) => {
    const client = new BookerClient(request);
    await use(client);
    await client.cleanup();
  },
});

export { expect };
