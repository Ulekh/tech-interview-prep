interface Array<T> {
  myFilter(
    callback: (value: T, index: number, array: T[]) => boolean,
    thisArg?: any,
  ): T[];
}
