type ArrayValue = any | Array<ArrayValue>;

export default function flatten(value: Array<ArrayValue>): Array<any> {
  const resss = [];
  for (const item of value) {
    if (Array.isArray(item)) {
      const result = flatten(item);
      console.log('reuslt', result);
    }
    console.log('loop item', item);
    resss.push(item);
  }
  console.log('fn result', resss);
  return resss;
}
