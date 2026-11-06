import cancellableInterval from './index';

describe('cancellable-interval', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns a function', () => {
    expect(cancellableInterval(() => {})).toBeTypeOf('function');
  });

  describe('cancelled', () => {
    it('immediately', () => {
      const callback = vi.fn();

      const cancel = cancellableInterval(callback, 10);
      cancel();
      expect(callback).not.toHaveBeenCalled();

      vi.advanceTimersByTime(10);
      expect(callback).not.toHaveBeenCalled();
    });

    it('after running once', () => {
      const callback = vi.fn();

      const cancel = cancellableInterval(callback, 10);
      expect(callback).not.toHaveBeenCalled();

      vi.advanceTimersByTime(15);
      expect(callback).toHaveBeenCalledTimes(1);

      cancel();
      vi.advanceTimersByTime(30);
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('after running twice', () => {
      const callback = vi.fn();

      const cancel = cancellableInterval(callback, 10);
      expect(callback).not.toHaveBeenCalled();

      vi.advanceTimersByTime(20);
      expect(callback).toHaveBeenCalledTimes(2);

      cancel();
      vi.advanceTimersByTime(30);
      expect(callback).toHaveBeenCalledTimes(2);
    });
  });

  it('uses parameters', () => {
    let i = 1;
    const callback = vi.fn((foo: number, bar: number) => {
      i += foo;
      i *= bar;
    });

    const cancel = cancellableInterval(callback, 10, 2, 7);
    expect(i).toBe(1);

    vi.advanceTimersByTime(10);
    expect(i).toBe(21);

    vi.advanceTimersByTime(10);
    expect(i).toBe(161);
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenCalledWith(2, 7);

    cancel();
  });
});
