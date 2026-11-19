---
name: new-page-object
description: Scaffold a new Page Object in pages/ and register it as a fixture. Use when the user asks to add or model a new page or component for UI tests.
---

1. Read `.claude/rules/page-objects.md`, `pages/LoginPage.ts` and `fixtures/index.ts`.
2. Create `pages/<Name>Page.ts` following the same shape: `constructor(private readonly page: Page)`, intent-level methods, preferred locators, no assertions.
3. Register it in `fixtures/index.ts`: add it to the `base.extend<{...}>` type and add a fixture that does `await use(new <Name>Page(page))`.
4. If the page is live, verify locators with the Playwright MCP (navigate, snapshot) rather than guessing.
5. Run `npx tsc --noEmit` if available, then list the files changed.
