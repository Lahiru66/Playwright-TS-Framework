# Writing tests

- Specs live in `tests/ui/<area>.spec.ts` (UI) or `tests/api/<area>.spec.ts` (API); never put specs directly in `tests/`. UI specs import `test, expect` from `../../fixtures`; API specs use the `request` fixture, directly or through a client fixture such as `booker`.
- Never use `waitForTimeout` or fixed sleeps. Rely on auto-waiting and web-first assertions (`await expect(locator).toBeVisible()`).
- Tests must be independent: no shared state or ordering (`fullyParallel` is on).
- Every test has exactly one tag, `{ tag: '@smoke' }` (critical happy path) or `{ tag: '@regression' }` (everything deeper). CI runs the two suites as parallel jobs and fails if a test has neither.
- Each test creates and cleans up its own data (see the `booker` fixture); never depend on data created by another test, since smoke and regression run concurrently.
- Test titles describe behaviour ("shows an error for an invalid password"), not implementation.
- Do not commit `test.only` or `test.skip` (CI sets `forbidOnly`). Use `test.fixme` with a comment for known failures.
- API tests build URLs from `env.bookingApiUrl` and assert status and body, not just status.
- Don't add browsers/projects or change reporters without being asked; the suite is intentionally chromium-only.
