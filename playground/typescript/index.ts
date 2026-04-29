/**
 * TypeScript Playground
 * Use this file to experiment with TS features, algorithms, or snippets.
 */

const greeting = (name: string): string => {
  return `Hello, ${name}! Welcome to the TS Playground.`;
};

console.log(greeting('User'));

// You can also add tests here or in index.test.ts to verify your logic
if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;
  it('greeting works', () => {
    expect(greeting('Vitest')).toContain('Hello, Vitest');
  });
}
