# Playwright TS Framework

A Playwright + TypeScript test automation framework covering **UI** and **API** tests, with Allure reporting and a GitHub Actions pipeline.

## Features

- Page Object Model with fixtures (`fixtures/index.ts`)
- UI and API specs in one suite
- Per-environment config (`dev`, `staging`) selected via `TEST_ENV`
- JSON-driven test data, exported through `test-data/index.ts`
- HTML and Allure reports
- CI on GitHub Actions running inside the official Playwright Docker container (`mcr.microsoft.com/playwright`), so browsers and system dependencies match the pinned Playwright version
- Chromium-only, fully parallel runs

## Prerequisites

- Node.js (LTS)
- Java 17 (only needed to generate the Allure report locally)

## Getting started

```bash
git clone https://github.com/Lahiru66/playwright-ts-framework.git
cd playwright-ts-framework
npm ci
npx playwright install chromium
```

## Running tests

```bash
npx playwright test                      # run everything
npx playwright test tests/ui.spec.ts     # a single file
npx playwright test --grep @smoke        # smoke suite only
npx playwright test --grep @regression   # regression suite only
npx playwright test --headed             # watch the browser
npx playwright test --debug              # step through with the inspector
```

### Choosing an environment

The default environment is `dev`. Set `TEST_ENV` to switch:

```bash
TEST_ENV=staging npx playwright test
```

PowerShell:

```powershell
$env:TEST_ENV='staging'; npx playwright test
```

An unknown `TEST_ENV` fails fast and lists the available environments.

## Reports

```bash
npx playwright show-report                                   # HTML report
npx allure generate allure-results --clean -o allure-report  # Allure report (needs Java)
npx allure open allure-report
```

## Project structure

```
.
├── tests/                  # *.spec.ts files (UI and API)
├── pages/                  # Page Object classes
├── fixtures/index.ts       # Extended `test` exposing page objects as fixtures
├── config/
│   ├── env.ts              # Loads the active environment config
│   └── environments/       # dev.json, staging.json (baseUrl, apiUrl)
├── test-data/              # JSON data, re-exported via index.ts
├── playwright.config.ts
└── .github/workflows/      # CI pipeline
```

## Writing tests

- UI specs import `test, expect` from `../fixtures`; API specs can use `@playwright/test` with the `request` fixture.
- Page objects take `page` in the constructor, expose user-intent methods and contain no assertions. Register each one in `fixtures/index.ts`.
- Use `getByRole` / `getByLabel` / `getByText` locators first; avoid XPath.
- No fixed sleeps (`waitForTimeout`). Rely on auto-waiting and web-first assertions.
- Keep tests independent, since `fullyParallel` is on.
- Put data in `test-data/*.json` and URLs in `config/environments/*.json`. Never hard-code hosts or commit secrets.
- Don't commit `test.only` or `test.skip`; CI sets `forbidOnly`.

## Adding an environment

1. Copy `config/environments/dev.json` to `config/environments/<name>.json` with the same keys.
2. Run with `TEST_ENV=<name>`.

## Continuous integration

`.github/workflows/playwright.yml` runs on every push and pull request. It:

1. Runs the **smoke** and **regression** suites as two parallel jobs, each inside the `mcr.microsoft.com/playwright` container (the tag must match the `@playwright/test` version in `package.json`). A guard step fails the build if any test is missing a `@smoke` or `@regression` tag.
2. Merges both suites' results into one Allure report and uploads it as the `allure-report` artifact (14-day retention).
3. On `main`, publishes the Allure report to GitHub Pages so it can be opened in the browser (see below).
4. Sends an email summary of the run, including the report link.

Required repository secrets for the email step: `SMTP_USERNAME`, `SMTP_PASSWORD`, `TO_EMAIL`.

### Pipeline overview

```mermaid
flowchart TD
    A([Push / Pull request]) --> S
    A --> R

    subgraph S [smoke job - parallel]
        direction TD
        S1[Checkout and npm ci] --> S2[Tag guard] --> S3["Run @smoke tests"] --> S4[Upload allure-results-smoke]
    end

    subgraph R [regression job - parallel]
        direction TD
        R1[Checkout and npm ci] --> R3["Run @regression tests"] --> R4[Upload allure-results-regression]
    end

    S --> M[Report job: merge results and generate Allure report]
    R --> M
    M --> H[Upload allure-report artifact]
    H --> J[Deploy report to GitHub Pages - main only]
    J --> I[Send email summary]

    classDef always fill:#fff4d6,stroke:#d9a400,color:#333;
    class M,H,J,I always;
```

Both test jobs run inside the Playwright Docker container. Steps in yellow use `if: always()`, so the merged report, artifact, Pages deploy and email happen even when tests fail. The workflow defines four jobs: `test` (a matrix that produces the smoke and regression jobs), `report`, `deploy-report` and `notify`.

### Test tags

Every test carries exactly one tag, set with Playwright's `tag` option:

```ts
test('returns a token for valid credentials', { tag: '@smoke' }, async ({ booker }) => { ... });
```

- `@smoke`: fast, critical happy-path checks.
- `@regression`: deeper, negative and edge-case checks.

The two suites run in parallel in CI, so tests must own their data (create it, use it, clean it up) and never rely on data another test creates.

### Viewing the Allure report

- **In the browser (latest `main` run):** https://lahiru66.github.io/Playwright-TS-Framework/
  One-time setup: repo **Settings → Pages → Source: GitHub Actions**. The report is public because the repo is public.
- **Any run (including pull requests):** open the run under the **Actions** tab and download the `allure-report` artifact (kept 14 days), then `npx allure open <folder>`.

## License

See [LICENSE](LICENSE).
