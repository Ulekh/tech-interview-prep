export default function promiseTimeout<T>(promise: Promise<T>, duration: number): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject('Promise timeout'), duration);
    promise.then((result) => resolve(result)).catch((err) => reject(err));
  });
}
