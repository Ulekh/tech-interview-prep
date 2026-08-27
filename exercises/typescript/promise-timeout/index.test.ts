import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import promiseTimeout from './index';

describe('promiseTimeout', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('returns a promise', async () => {
    const promise = promiseTimeout(Promise.resolve(1), 100);
    expect(promise).toBeInstanceOf(Promise);
    await expect(promise).resolves.toBe(1);
  });

  describe('settled', () => {
    describe('resolved', () => {
      test('immediately', async () => {
        const promise = promiseTimeout(Promise.resolve(42), 100);
        await expect(promise).resolves.toBe(42);
      });

      test('next tick', async () => {
        const promise = promiseTimeout(
          new Promise((resolve) => {
            setTimeout(() => {
              resolve(42);
            }, 0);
          }),
          100
        );
        const expectation = expect(promise).resolves.toBe(42);

        await vi.advanceTimersByTimeAsync(0);
        await expectation;
      });

      test('before timeout', async () => {
        const promise = promiseTimeout(
          new Promise((resolve) => {
            setTimeout(() => {
              resolve(42);
            }, 50);
          }),
          100
        );
        const expectation = expect(promise).resolves.toBe(42);

        await vi.advanceTimersByTimeAsync(50);
        await expectation;
      });
    });

    describe('rejected', () => {
      test('immediately', async () => {
        const promise = promiseTimeout(Promise.reject(42), 100);
        await expect(promise).rejects.toBe(42);
      });

      test('next tick', async () => {
        const promise = promiseTimeout(
          new Promise((_, reject) => {
            setTimeout(() => {
              reject(42);
            }, 0);
          }),
          100
        );
        const expectation = expect(promise).rejects.toBe(42);

        await vi.advanceTimersByTimeAsync(0);
        await expectation;
      });

      test('before timeout', async () => {
        const promise = promiseTimeout(
          new Promise((_, reject) => {
            setTimeout(() => {
              reject(42);
            }, 50);
          }),
          100
        );
        const expectation = expect(promise).rejects.toBe(42);

        await vi.advanceTimersByTimeAsync(50);
        await expectation;
      });
    });
  });

  describe('timeout', () => {
    test('immediate', async () => {
      const promise = promiseTimeout(
        new Promise((resolve) => {
          setTimeout(() => {
            resolve(42);
          }, 500);
        }),
        0
      );
      const expectation = expect(promise).rejects.toBe('Promise timeout');

      await vi.advanceTimersByTimeAsync(0);
      await expectation;
    });

    test('all immediate', async () => {
      const promise = promiseTimeout(
        new Promise((resolve) => {
          setTimeout(() => {
            resolve(42);
          }, 0);
        }),
        0
      );
      const expectation = expect(promise).resolves.toBe(42);

      await vi.advanceTimersByTimeAsync(0);
      await expectation;
    });

    test('non-immediate', async () => {
      const promise = promiseTimeout(
        new Promise((resolve) => {
          setTimeout(() => {
            resolve(42);
          }, 200);
        }),
        100
      );
      const expectation = expect(promise).rejects.toBe('Promise timeout');

      await vi.advanceTimersByTimeAsync(100);
      await expectation;
    });
  });
});
