import { test, expect } from '../fixtures';

test('example.com has the expected title', async ({ examplePage }) => {
  await examplePage.goto();
  expect(await examplePage.title()).toBe('Example Domain');
});
