import { renderHook } from '@testing-library/react';

import useEffectOnce from './index';

describe('useEffectOnce', () => {
  test('returns nothing', () => {
    const { result } = renderHook(() => useEffectOnce(() => {}));

    expect(result.current).toBe(undefined);
  });

  test('calls the effect once', () => {
    let counter = 0;

    const { rerender } = renderHook(() =>
      useEffectOnce(() => {
        counter += 1;
      })
    );

    expect(counter).toBe(1);

    rerender();

    expect(counter).toBe(1);
  });

  test('cleanup function works', () => {
    let counter = 0;

    const { unmount } = renderHook(() =>
      useEffectOnce(() => {
        counter += 1;

        return () => {
          counter += 1;
        };
      })
    );

    expect(counter).toBe(1);

    unmount();

    expect(counter).toBe(2);
  });

  test('does not run cleanup on ordinary rerenders', () => {
    let cleanups = 0;

    const { rerender, unmount } = renderHook(() =>
      useEffectOnce(() => {
        return () => {
          cleanups += 1;
        };
      })
    );

    expect(cleanups).toBe(0);

    rerender();

    expect(cleanups).toBe(0);

    unmount();

    expect(cleanups).toBe(1);
  });
});
