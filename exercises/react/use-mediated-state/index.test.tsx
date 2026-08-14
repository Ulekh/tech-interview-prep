import { act, renderHook } from '@testing-library/react';

import useMediatedState from './index';
import { useState } from 'react';

describe('useMediatedState', () => {
  test('return values', () => {
    const { result } = renderHook(() => useMediatedState(() => {}));

    expect(Array.isArray(result.current)).toBe(true);
    expect(result.current.length).toBe(2);
    expect(typeof result.current[0]).toBe('undefined');
    expect(typeof result.current[1]).toBe('function');
  });

  test('initial state', () => {
    const initialState = 42;
    const { result } = renderHook(() => useMediatedState(() => initialState, initialState));

    expect(result.current[0]).toBe(initialState);
  });

  test('mediator', () => {
    const { result } = renderHook(() => useMediatedState((x) => x * 2, 1));

    act(() => result.current[1](2));

    expect(result.current[0]).toBe(4);
  });

  test('mediator with dispatch', () => {
    const { result } = renderHook(() =>
      // @ts-expect-error
      useMediatedState((x, dispatch) => dispatch(x * 2), 1)
    );

    act(() => result.current[1](2));

    expect(result.current[0]).toBe(4);
  });

  test('works with updater function', () => {
    const { result } = renderHook(() => useMediatedState((x) => x * 2, 1));

    act(() => result.current[1]((x) => x + 1));

    expect(result.current[0]).toBe(4);
  });

  test('updater functions compose from the latest state', () => {
    const { result } = renderHook(() => useMediatedState((x) => x, 1));

    act(() => {
      result.current[1]((x) => x + 1);
      result.current[1]((x) => x + 1);
    });

    expect(result.current[0]).toBe(3);
  });

  test('works with updater function and dispatch', () => {
    const { result } = renderHook(() =>
      // @ts-expect-error
      useMediatedState((x, dispatch) => dispatch(x * 2), 1)
    );

    act(() => result.current[1]((x) => x + 1));

    expect(result.current[0]).toBe(4);
  });

  test('keeps previous state when dispatch mediator does not dispatch', () => {
    const { result } = renderHook(() =>
      // @ts-expect-error
      useMediatedState((_x, _dispatch) => {}, 1)
    );

    act(() => result.current[1](2));

    expect(result.current[0]).toBe(1);
  });

  test('supports asynchronous mediator dispatch', async () => {
    const { result } = renderHook(() =>
      useMediatedState(
        // @ts-expect-error
        (x, dispatch) => {
          Promise.resolve().then(() => dispatch(x * 2));
        },
        1
      )
    );

    act(() => result.current[1](2));

    expect(result.current[0]).toBe(1);

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current[0]).toBe(4);
  });

  test('setState has a stable identity across state updates', () => {
    const { result } = renderHook(() => useMediatedState((x) => x, 1));
    const setState = result.current[1];

    act(() => result.current[1](2));

    expect(result.current[1]).toBe(setState);
  });
});
