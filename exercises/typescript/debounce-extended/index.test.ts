import debounce from './index';

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('can be initialized', () => {
    const increment = debounce(() => {}, 50);
    expect(increment).toBeTruthy();
  });

  it('executes after duration', () => {
    let i = 0;
    const increment = debounce(() => {
      i++;
    }, 10);

    increment();
    expect(i).toBe(0);

    vi.advanceTimersByTime(10);
    expect(i).toBe(1);
  });

  describe('uses arguments', () => {
    it('called once', () => {
      let i = 21;
      const increment = debounce((a: number, b: number) => {
        i += a * b;
      }, 10);

      expect(i).toBe(21);
      increment(3, 7);
      expect(i).toBe(21);

      vi.advanceTimersByTime(20);
      expect(i).toBe(42);
    });

    it('uses arguments of latest invocation', () => {
      let i = 21;
      const increment = debounce((a: number, b: number) => {
        i += a * b;
      }, 10);

      expect(i).toBe(21);
      increment(3, 7);
      increment(4, 5);
      expect(i).toBe(21);

      vi.advanceTimersByTime(20);
      expect(i).toBe(41);
    });
  });

  it('execute once even after calling it multiple times', () => {
    let i = 0;
    const increment = debounce(() => {
      i++;
    }, 20);

    expect(i).toBe(0);
    increment();
    increment();
    increment();
    increment();
    expect(i).toBe(0);

    // Should not fire yet.
    vi.advanceTimersByTime(10);
    expect(i).toBe(0);

    vi.advanceTimersByTime(20);
    expect(i).toBe(1);
  });

  it('duration extended if called again during window', () => {
    let i = 0;
    const increment = debounce(() => {
      i++;
    }, 100);

    expect(i).toBe(0);
    increment();
    increment();
    expect(i).toBe(0);

    // Should not fire yet.
    vi.advanceTimersByTime(50);
    expect(i).toBe(0);
    increment();
    expect(i).toBe(0);

    // t=125: still 0 because we called again at t=50, so it fires at t=150.
    vi.advanceTimersByTime(75);
    expect(i).toBe(0);

    vi.advanceTimersByTime(25);
    expect(i).toBe(1);
  });

  it('callbacks can access `this`', () => {
    const increment = debounce(function (this: any, delta: number) {
      this.val += delta;
    }, 10);

    const obj = {
      val: 2,
      increment,
    };

    expect(obj.val).toBe(2);
    obj.increment(3);
    expect(obj.val).toBe(2);

    vi.advanceTimersByTime(20);
    expect(obj.val).toBe(5);
  });
});
