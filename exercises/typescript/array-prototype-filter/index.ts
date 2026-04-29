interface Array<T> {
  myFilter(
    callbackFn: (value: T, index: number, array: Array<T>) => boolean,
    thisArg?: any,
  ): Array<T>;
}

Array.prototype.myFilter = function (callbackFn, thisArg) {
  const len = this.length;
  const results = [];

  // Snapshot the original range so callback-side pushes do not extend the walk.
  for (let k = 0; k < len; k++) {
    const kValue = this[k];
    if (
      // Native filter skips holes entirely instead of invoking the predicate
      // with `undefined` for missing indexes.
      Object.hasOwn(this, k) &&
      callbackFn.call(thisArg, kValue, k, this)
    ) {
      results.push(kValue);
    }
  }

  return results;
};
