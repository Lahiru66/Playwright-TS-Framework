import { test, expect } from '../fixtures/booker';
import { testData } from '../test-data';

const { newBooking, updatedBooking, partialUpdate, nonExistentId } = testData.bookings;

test.describe('Restful-Booker: authentication', () => {
  test('returns a token for valid credentials', { tag: '@smoke' }, async ({ booker }) => {
    const response = await booker.authRequest(booker.credentials());
    expect(response.status()).toBe(200);
    expect((await response.json()).token).toEqual(expect.any(String));
  });

  test(
    'rejects invalid credentials without issuing a token',
    { tag: '@regression' },
    async ({ booker }) => {
      const response = await booker.authRequest({ username: 'admin', password: 'wrong-password' });
      const body = await response.json();
      expect(body.reason).toBe('Bad credentials');
      expect(body.token).toBeUndefined();
    },
  );
});

test.describe('Restful-Booker: bookings', () => {
  test(
    'creates a booking and echoes the submitted details',
    { tag: '@smoke' },
    async ({ booker }) => {
      const created = await booker.createBooking(newBooking);
      expect(created.bookingid).toEqual(expect.any(Number));
      expect(created.booking).toEqual(newBooking);
    },
  );

  test('returns the stored booking by id', { tag: '@smoke' }, async ({ booker }) => {
    const { bookingid } = await booker.createBooking(newBooking);
    const response = await booker.getBooking(bookingid);
    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual(newBooking);
  });

  test(
    'lists a newly created booking among all bookings',
    { tag: '@regression' },
    async ({ booker }) => {
      const { bookingid } = await booker.createBooking(newBooking);
      const response = await booker.listBookings();
      expect(response.status()).toBe(200);
      const ids = (await response.json()).map((b: { bookingid: number }) => b.bookingid);
      expect(ids).toContain(bookingid);
    },
  );

  test('replaces a booking with a full update', { tag: '@regression' }, async ({ booker }) => {
    const { bookingid } = await booker.createBooking(newBooking);
    const response = await booker.updateBooking(bookingid, updatedBooking);
    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual(updatedBooking);
  });

  test(
    'changes only the supplied fields with a partial update',
    { tag: '@regression' },
    async ({ booker }) => {
      const { bookingid } = await booker.createBooking(newBooking);
      const response = await booker.patchBooking(bookingid, partialUpdate);
      expect(response.status()).toBe(200);
      expect(await response.json()).toEqual({ ...newBooking, ...partialUpdate });
    },
  );

  test(
    'deletes a booking so it can no longer be fetched',
    { tag: '@regression' },
    async ({ booker }) => {
      const { bookingid } = await booker.createBooking(newBooking);
      const deleted = await booker.deleteBooking(bookingid);
      expect(deleted.status()).toBe(201);
      const fetched = await booker.getBooking(bookingid);
      expect(fetched.status()).toBe(404);
    },
  );

  test(
    'returns 404 for a booking that does not exist',
    { tag: '@regression' },
    async ({ booker }) => {
      const response = await booker.getBooking(nonExistentId);
      expect(response.status()).toBe(404);
    },
  );

  test(
    'refuses to update a booking without a token',
    { tag: '@regression' },
    async ({ booker }) => {
      const { bookingid } = await booker.createBooking(newBooking);
      const response = await booker.updateBooking(bookingid, updatedBooking, false);
      expect(response.status()).toBe(403);
      const unchanged = await booker.getBooking(bookingid);
      expect(await unchanged.json()).toEqual(newBooking);
    },
  );
});
