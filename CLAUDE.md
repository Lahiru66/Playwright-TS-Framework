# playwright-ts-framework

Playwright + TypeScript test framework (UI and API), with Allure reporting and a GitHub Actions pipeline.

## Commands
- `npx playwright test` — run everything (chromium only)
- `npx playwright test tests/ui.spec.ts` — one file; add `--headed` or `--debug` when investigating
- `npx playwright test --grep @smoke` / `--grep @regression` — one suite (CI runs them as two parallel jobs)
- `TEST_ENV=staging npx playwright test` — pick an environment (default `dev`; PowerShell: `$env:TEST_ENV='staging'`)
- `npx playwright show-report` — HTML report
- `npx allure generate allure-results --clean -o allure-report` — Allure report (needs Java)
- There is no `npm test` script yet.

## Layout
- `tests/` — `*.spec.ts` files (UI and API)
- `pages/` — Page Object classes
- `fixtures/index.ts` — extends Playwright `test` and exposes page objects as fixtures
- `config/env.ts` + `config/environments/<name>.json` — per-environment `baseUrl` / `apiUrl`, selected by `TEST_ENV`
- `test-data/` — JSON data, re-exported through `test-data/index.ts`
- `.github/workflows/playwright.yml` — CI; runs in the Playwright container pinned to the installed `@playwright/test` version

## Conventions
Detailed rules live in `.claude/rules/` (page objects, tests, data and config). Skills in `.claude/skills/` scaffold new pages/tests and debug failures.

## Keep in sync
- The CI container tag must match the `@playwright/test` version in `package.json`.
- Generated output (`test-results/`, `playwright-report/`, `allure-results/`, `.playwright-mcp/`) is never committed.

## Restful-Booker API tests
- `tests/booking.spec.ts` runs against https://restful-booker.herokuapp.com (`bookingApiUrl` in `config/environments/*.json`) through the `booker` fixture in `fixtures/booker.ts`, which deletes any booking a test created.
- Optional env vars: `BOOKER_USERNAME` / `BOOKER_PASSWORD` (default to the API's public demo credentials).

## Sauce Demo UI tests
- `tests/shop.spec.ts` runs against https://www.saucedemo.com (`shopUrl` in `config/environments/*.json`, applied with `test.use({ baseURL: env.shopUrl })`) using the `LoginPage`, `InventoryPage`, `CartPage` and `CheckoutPage` fixtures.
- `loggedInInventory` fixture logs in as the standard user for a fresh session. The cart lives in the browser's localStorage, so each test is isolated and parallel-safe.
- Demo users in `test-data/shop.json` are the site's published public logins, not real credentials.
- `playwright.config.ts` sets `testIdAttribute: 'data-test'` because Sauce Demo uses `data-test` attributes.
