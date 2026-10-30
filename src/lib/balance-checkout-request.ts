/** Keep one checkout request per current link, including effect replays. */
export function createBalanceCheckoutRequest<T>(request: (token: string) => Promise<T>) {
  let current: { token: string; promise: Promise<T> } | undefined;
  return (token: string): Promise<T> => {
    if (current?.token === token) return current.promise;
    const promise = request(token);
    current = { token, promise };
    return promise;
  };
}