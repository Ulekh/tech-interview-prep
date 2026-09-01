export default function promiseAny<T>(iterable: Array<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    if (!iterable.length) {
      reject(new AggregateError('some error'));
      return;
    }
    let failedPromises = 0;
    iterable.forEach(async (item) => {
      try {
        const response = await item;
        resolve(response);
        return;
      } catch (err) {
        failedPromises++;
      } finally {
        if (failedPromises === iterable.length) {
          reject(new AggregateError('some error'));
          return;
        }
      }
    });
  });
}
