# playwright-ts-framework

Playwright + TypeScript test framework (UI and API), with Allure reporting and a GitHub Actions pipeline.

## Commands

- `npm test` — run everything (chromium only); `npm run test:smoke` / `test:regression` — one suite (CI runs them as two parallel jobs); `npm run test:ui` / `test:api` — one layer
- `npx playwright test tests/ui/shop.spec.ts` — one file; add `--headed` or `--debug` when investigating
- `TEST_ENV=staging npm test` — pick an environment (default `dev`; PowerShell: `$env:TEST_ENV='staging'`)
- `npm run typecheck`, `npm run lint`, `npm run format:check` — static checks that CI runs in a `lint` job; `npm run format` fixes formatting
- `npm run report` — HTML report; `npm run allure:generate` then `npm run allure:open` — Allure report (needs Java)
- Failed tests keep a screenshot in `test-results/` (and a trace on retry); CI uploads them as `failure-evidence-<suite>` artifacts.

## Layout

- `tests/ui/` and `tests/api/` — `*.spec.ts` files, one folder per test layer
- `pages/` — Page Object classes
- `fixtures/index.ts` — extends Playwright `test` and exposes page objects as fixtures
- `config/env.ts` + `config/environments/<name>.json` — per-environment `baseUrl` (Sauce Demo) / `bookingApiUrl` (Restful-Booker), selected by `TEST_ENV`
- `test-data/` — JSON data, re-exported through `test-data/index.ts`
- `.github/workflows/playwright.yml` — CI; runs in the Playwright container pinned to the installed `@playwright/test` version

## Conventions

Detailed rules live in `.claude/rules/` (page objects, tests, data and config). Skills in `.claude/skills/` scaffold new pages/tests and debug failures.

## Keep in sync

- The CI container tag must match the `@playwright/test` version in `package.json`.
- Generated output (`test-results/`, `playwright-report/`, `allure-results/`, `.playwright-mcp/`) is never committed.

## Restful-Booker API tests

- `tests/api/booking.spec.ts` runs against https://restful-booker.herokuapp.com (`bookingApiUrl` in `config/environments/*.json`) through the `booker` fixture in `fixtures/booker.ts`, which deletes any booking a test created.
- Optional env vars: `BOOKER_USERNAME` / `BOOKER_PASSWORD` (default to the API's public demo credentials).

## Sauce Demo UI tests

- `tests/ui/shop.spec.ts` runs against https://www.saucedemo.com (`baseUrl` in `config/environments/*.json`, used as Playwright's `baseURL`) using the `LoginPage`, `InventoryPage`, `CartPage` and `CheckoutPage` fixtures.
- `loggedInInventory` fixture logs in as the standard user for a fresh session. The cart lives in the browser's localStorage, so each test is isolated and parallel-safe.
- Demo users in `test-data/shop.json` are the site's published public logins, not real credentials.
- `playwright.config.ts` sets `testIdAttribute: 'data-test'` because Sauce Demo uses `data-test` attributes.
