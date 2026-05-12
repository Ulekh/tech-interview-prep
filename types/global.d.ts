interface Array<T> {
  myFilter(
    callback: (value: T, index: number, array: T[]) => boolean,
    thisArg?: any,
  ): T[];
}

declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}
