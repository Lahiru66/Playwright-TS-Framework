import { test, expect } from '../fixtures';

test('example.com has the expected title', { tag: '@smoke' }, async ({ examplePage }) => {
  await examplePage.goto();
  expect(await examplePage.title()).toBe('Example Domain');
});
