---
name: debug-failing-test
description: Diagnose a failing or flaky Playwright test using the report, trace and Playwright MCP. Use when a test fails locally or in CI.
---

1. Re-run the single failing test: `npx playwright test <file> -g "<title>"`. Note the exact error and line.
2. For CI failures, check the workflow run and download the report/trace artifacts. Traces are captured on first retry (`trace: 'on-first-retry'`); open with `npx playwright show-trace <trace.zip>`.
3. Inspect the live page with the Playwright MCP (navigate, snapshot, console and network messages) to see whether the locator, timing or the app itself is the problem.
4. Check the environment first: wrong `TEST_ENV`, unreachable `bookingApiUrl`, changed test data.
5. Fix the root cause (better locator, proper web-first assertion). Do not paper over it with sleeps, `retries` or `.skip`.
6. Re-run to confirm, and say what was wrong and what you changed.
