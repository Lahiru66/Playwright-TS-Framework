---
name: new-test
description: Write a new UI or API spec following this framework's conventions. Use when the user asks to add a test or test case.
---

1. Read `.claude/rules/tests.md` and `.claude/rules/test-data-and-config.md`, plus `tests/ui.spec.ts` and `tests/api.spec.ts` as models.
2. Decide UI vs API. UI: import `test, expect` from `../fixtures` and use page-object fixtures (create the page via the `new-page-object` skill if missing). API: use the `request` fixture and `env.apiUrl`.
3. Put any input data in `test-data/` and import via `testData`.
4. Write the spec in `tests/<area>.spec.ts` with behaviour-describing titles and web-first assertions.
5. Run just that file with `npx playwright test tests/<file>.spec.ts` and report the result honestly, including failures.
