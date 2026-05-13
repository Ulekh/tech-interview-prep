interface DebouncedFunction extends Function {
  cancel: () => void;
  flush: () => void;
}

export default function debounce(func: Function, wait: number): DebouncedFunction {
  let timerID: null | ReturnType<typeof setTimeout> = null;
  let lastArgs: any[] | null = null;
  let lastThis: any | null = null;

  const invoke = () => {
    if (timerID) {
      clearTimeout(timerID);
      timerID = null;
    }

    if (lastArgs) {
      func.apply(lastThis!, lastArgs);
      lastArgs = null;
      lastThis = null;
    }
  };

  function wrapper(this: any, ...args: any[]) {
    lastArgs = args;
    lastThis = this;
    if (timerID) {
      clearTimeout(timerID);
    }
    timerID = setTimeout(invoke, wait);
  }

  wrapper.cancel = () => {
    if (timerID) {
      clearTimeout(timerID);
    }
    timerID = null;
    lastArgs = null;
    lastThis = null;
  };

  wrapper.flush = invoke;

  return wrapper;
}
