# Page objects

- One class per page or component in `pages/`, named `<Name>Page.ts`.
- Extend `BasePage` (`pages/BasePage.ts`), which provides `protected page`, `open(path)` and the shared `errorMessage()`; don't declare your own constructor unless you need extra dependencies. See `pages/LoginPage.ts`.
- Put behaviour shared by every page in `BasePage`, and keep page-specific locators in the page class.
- Expose user-intent methods (`login(user)`), not raw locator plumbing.
- Locator priority: `getByRole` > `getByLabel` / `getByText` > `getByTestId` > CSS. Avoid XPath and brittle nth-child chains.
- Use relative paths in `goto()` (e.g. `'/'`); the host comes from `baseURL` in `playwright.config.ts`.
- No `expect` assertions in page objects: return values or locators and assert in the spec.
- Every page object is registered as a fixture in `fixtures/index.ts`.
