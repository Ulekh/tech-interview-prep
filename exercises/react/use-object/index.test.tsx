import { act, renderHook } from '@testing-library/react';

import useObject from './index';

describe('useObject', () => {
  test('return values', () => {
    const { result } = renderHook(() => useObject({}));

    expect(Array.isArray(result.current)).toBe(true);
    expect(result.current).toHaveLength(2);
    expect(typeof result.current[0]).toBe('object');
    expect(typeof result.current[1]).toBe('function');
  });

  test('initial value', () => {
    const initialValue = { foo: 'bar' };
    const { result } = renderHook(() => useObject(initialValue));

    expect(result.current[0]).toEqual(initialValue);
  });

  test('update object', () => {
    const { result } = renderHook(() => useObject({}));

    act(() => result.current[1]({ foo: 'bar' }));

    expect(result.current[0]).toEqual({ foo: 'bar' });
  });

  test('update object with updater function', () => {
    const { result } = renderHook(() => useObject({}));

    act(() => result.current[1]((prev) => ({ ...prev, foo: 'bar' })));

    expect(result.current[0]).toEqual({ foo: 'bar' });
  });

  test('merge object', () => {
    const { result } = renderHook(() => useObject<Record<string, string>>({ bar: 'foo' }));

    act(() => result.current[1]({ foo: 'bar' }));

    expect(result.current[0]).toEqual({ bar: 'foo', foo: 'bar' });
  });

  test('merge object with updater function', () => {
    const { result } = renderHook(() => useObject<Record<string, string>>({ bar: 'foo' }));

    act(() => result.current[1](() => ({ foo: 'bar' })));

    expect(result.current[0]).toEqual({ bar: 'foo', foo: 'bar' });
  });

  test('throws when update is not a plain object', () => {
    const { result } = renderHook(() => useObject({ foo: 'bar' }));

    expect(() => {
      act(() => result.current[1]([] as any));
    }).toThrow('Invalid new state');
  });

  test('throws when updater function returns a non-plain object', () => {
    const { result } = renderHook(() => useObject({ foo: 'bar' }));

    expect(() => {
      act(() => result.current[1](() => [] as any));
    }).toThrow('Invalid new state');
  });
});
